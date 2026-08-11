package app.weijin.notes;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ValueAnimator;
import android.Manifest;
import android.app.Activity;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Insets;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.SoundPool;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.SystemClock;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.provider.Settings;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsAnimation;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.core.splashscreen.SplashScreen;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class MainActivity extends Activity {
    public static final String CHANNEL_ID = "weijin_reminders_alerts_v6";
    private static final int NOTIFICATION_PERMISSION_REQUEST_CODE = 4102;
    private static final int VOICE_PERMISSION_REQUEST_CODE = 4103;
    private static final int IMAGE_CHOOSER_REQUEST_CODE = 4104;
    private static final String PREFERENCES_NAME = "weijin_native_preferences";
    private static final String NOTIFICATION_FIRST_RUN_ASKED =
            "notification_first_run_v3_asked";
    private static final String LAUNCH_THEME_PREFERENCE = "launch_theme";
    private static final String LAUNCH_DARK_PREFERENCE = "launch_dark";
    private static final long VOICE_RESTART_DELAY_MILLIS = 420L;
    private static final long VOICE_MAX_DURATION_MILLIS = 60_000L;
    private static final long VOICE_STOP_FALLBACK_MILLIS = 850L;
    private WebView webView;
    private ValueCallback<Uri[]> imageChooserCallback;
    private SpeechRecognizer speechRecognizer;
    private boolean voiceCancelRequested;
    private boolean voiceInputHeld;
    private int voiceRecognizerGeneration;
    private long voiceSessionId;
    private long voiceStartedAtMillis;
    private int voiceRestartAttempt;
    private Runnable voiceRestartRunnable;
    private Runnable voiceLimitRunnable;
    private Runnable voiceStopFallbackRunnable;
    private long voiceDeliveredSessionId = -1L;
    private int keyboardInsetBottomPixels;
    private int keyboardInsetTargetBottomPixels;
    private boolean keyboardInsetVisible;
    private boolean keyboardAnimationRunning;
    private boolean keyboardPublishScheduled;
    private int statusBarInsetTopPixels;
    private final StringBuilder voiceTranscript = new StringBuilder();
    private String voiceLatestPartial = "";
    private SoundPool interactionSoundPool;
    private MediaPlayer interactionFallbackPlayer;
    private MediaPlayer wheelLoopPlayer;
    private ValueAnimator wheelLoopVolumeAnimator;
    private float wheelLoopVolume;
    private final Map<String, Integer> interactionSoundIds = new HashMap<>();
    private final Map<String, Integer> interactionSoundResources = new HashMap<>();
    private final Set<Integer> loadedInteractionSoundIds = new HashSet<>();
    private int interactionTickIndex;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        getWindow().setSoftInputMode(
                WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING
                        | WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN
        );
        int launchSurfaceColor = storedLaunchSurfaceColor();
        getWindow().setStatusBarColor(launchSurfaceColor);
        getWindow().setNavigationBarColor(launchSurfaceColor);
        ensureNotificationChannel(this);
        initializeInteractionFeedback();

        webView = new WebView(this);
        webView.setBackgroundColor(launchSurfaceColor);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setLongClickable(false);
        webView.setHapticFeedbackEnabled(true);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setTextZoom(100);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(
                    WebView view,
                    ValueCallback<Uri[]> filePathCallback,
                    WebChromeClient.FileChooserParams fileChooserParams
            ) {
                if (imageChooserCallback != null) {
                    imageChooserCallback.onReceiveValue(null);
                }
                imageChooserCallback = filePathCallback;
                try {
                    startActivityForResult(
                            fileChooserParams.createIntent(),
                            IMAGE_CHOOSER_REQUEST_CODE
                    );
                    return true;
                } catch (ActivityNotFoundException error) {
                    imageChooserCallback = null;
                    return false;
                }
            }
        });
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                return !url.startsWith("file:///android_asset/");
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                publishWindowInsets();
            }
        });
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidNative");
        setContentView(webView);
        webView.setOnApplyWindowInsetsListener((view, insets) -> {
            Insets ime = insets.getInsets(WindowInsets.Type.ime());
            Insets statusBars = insets.getInsets(WindowInsets.Type.statusBars());
            keyboardInsetTargetBottomPixels = Math.max(0, ime.bottom);
            if (!keyboardAnimationRunning) {
                keyboardInsetBottomPixels = keyboardInsetTargetBottomPixels;
                keyboardInsetVisible = insets.isVisible(WindowInsets.Type.ime())
                        && keyboardInsetBottomPixels > 0;
            }
            statusBarInsetTopPixels = Math.max(0, statusBars.top);
            scheduleWindowInsetsPublish();
            return insets;
        });
        webView.setWindowInsetsAnimationCallback(new WindowInsetsAnimation.Callback(
                WindowInsetsAnimation.Callback.DISPATCH_MODE_CONTINUE_ON_SUBTREE
        ) {
            @Override
            public void onPrepare(WindowInsetsAnimation animation) {
                if ((animation.getTypeMask() & WindowInsets.Type.ime()) != 0) {
                    keyboardAnimationRunning = true;
                    scheduleWindowInsetsPublish();
                }
            }

            @Override
            public WindowInsetsAnimation.Bounds onStart(
                    WindowInsetsAnimation animation,
                    WindowInsetsAnimation.Bounds bounds
            ) {
                if ((animation.getTypeMask() & WindowInsets.Type.ime()) != 0) {
                    keyboardAnimationRunning = true;
                    scheduleWindowInsetsPublish();
                }
                return bounds;
            }

            @Override
            public WindowInsets onProgress(
                    WindowInsets insets,
                    List<WindowInsetsAnimation> runningAnimations
            ) {
                Insets ime = insets.getInsets(WindowInsets.Type.ime());
                keyboardInsetBottomPixels = Math.max(0, ime.bottom);
                keyboardInsetVisible = keyboardInsetBottomPixels > 0
                        || insets.isVisible(WindowInsets.Type.ime());
                scheduleWindowInsetsPublish();
                return insets;
            }

            @Override
            public void onEnd(WindowInsetsAnimation animation) {
                if ((animation.getTypeMask() & WindowInsets.Type.ime()) == 0) {
                    return;
                }
                WindowInsets finalInsets = webView.getRootWindowInsets();
                if (finalInsets != null) {
                    Insets ime = finalInsets.getInsets(WindowInsets.Type.ime());
                    keyboardInsetTargetBottomPixels = Math.max(0, ime.bottom);
                    keyboardInsetBottomPixels = keyboardInsetTargetBottomPixels;
                    keyboardInsetVisible = finalInsets.isVisible(WindowInsets.Type.ime())
                            && keyboardInsetBottomPixels > 0;
                } else {
                    keyboardInsetBottomPixels = keyboardInsetTargetBottomPixels;
                    keyboardInsetVisible = keyboardInsetBottomPixels > 0;
                }
                keyboardAnimationRunning = false;
                scheduleWindowInsetsPublish();
            }
        });
        webView.requestApplyInsets();
        webView.loadUrl("file:///android_asset/index.html");
        webView.postDelayed(this::requestInitialNotificationPermission, 2100L);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == IMAGE_CHOOSER_REQUEST_CODE) {
            if (imageChooserCallback != null) {
                Uri[] results = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
                imageChooserCallback.onReceiveValue(results);
                imageChooserCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            String[] permissions,
            int[] grantResults
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        boolean granted = grantResults.length > 0
                && grantResults[0] == PackageManager.PERMISSION_GRANTED;
        if (requestCode == VOICE_PERMISSION_REQUEST_CODE) {
            callJavaScript(
                    granted
                            ? "window.onNativeVoicePermissionGranted && window.onNativeVoicePermissionGranted()"
                            : "window.onNativeVoiceError && window.onNativeVoiceError(9)"
            );
            return;
        }
        if (requestCode == NOTIFICATION_PERMISSION_REQUEST_CODE) {
            return;
        }
    }

    private void requestInitialNotificationPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU || isFinishing()) {
            return;
        }
        boolean alreadyAsked = getSharedPreferences(PREFERENCES_NAME, MODE_PRIVATE)
                .getBoolean(NOTIFICATION_FIRST_RUN_ASKED, false);
        if (alreadyAsked) {
            return;
        }
        getSharedPreferences(PREFERENCES_NAME, MODE_PRIVATE)
                .edit()
                .putBoolean(NOTIFICATION_FIRST_RUN_ASKED, true)
                .apply();
        if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(
                    new String[]{Manifest.permission.POST_NOTIFICATIONS},
                    NOTIFICATION_PERMISSION_REQUEST_CODE
            );
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    private void callJavaScript(String script) {
        runOnUiThread(() -> {
            if (webView != null) {
                webView.evaluateJavascript(script, null);
            }
        });
    }

    private void publishWindowInsets() {
        if (webView == null) {
            return;
        }
        float density = Math.max(1f, getResources().getDisplayMetrics().density);
        float imeHeightCss = keyboardInsetBottomPixels / density;
        float webViewHeightCss = webView.getHeight() / density;
        float statusTopCss = statusBarInsetTopPixels / density;
        callJavaScript(
                "window.onNativeKeyboardInsets && window.onNativeKeyboardInsets("
                        + Math.round(imeHeightCss)
                        + ","
                        + Math.round(webViewHeightCss)
                        + ","
                        + keyboardInsetVisible
                        + ","
                        + keyboardAnimationRunning
                        + ")"
        );
        callJavaScript(
                "window.onNativeStatusBarInset && window.onNativeStatusBarInset("
                        + Math.round(statusTopCss)
                        + ")"
        );
    }

    private void scheduleWindowInsetsPublish() {
        if (webView == null || keyboardPublishScheduled) {
            return;
        }
        keyboardPublishScheduled = true;
        webView.postOnAnimation(() -> {
            keyboardPublishScheduled = false;
            publishWindowInsets();
        });
    }

    private static String firstRecognitionResult(Bundle results) {
        if (results == null) {
            return "";
        }
        ArrayList<String> values = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        return values == null || values.isEmpty() ? "" : values.get(0);
    }

    private void releaseSpeechRecognizer() {
        voiceRecognizerGeneration += 1;
        SpeechRecognizer recognizer = speechRecognizer;
        speechRecognizer = null;
        if (recognizer != null) {
            recognizer.destroy();
        }
    }

    private void cancelVoiceRestart() {
        if (webView != null && voiceRestartRunnable != null) {
            webView.removeCallbacks(voiceRestartRunnable);
        }
        voiceRestartRunnable = null;
    }

    private void cancelVoiceLimit() {
        if (webView != null && voiceLimitRunnable != null) {
            webView.removeCallbacks(voiceLimitRunnable);
        }
        voiceLimitRunnable = null;
    }

    private void cancelVoiceStopFallback() {
        if (webView != null && voiceStopFallbackRunnable != null) {
            webView.removeCallbacks(voiceStopFallbackRunnable);
        }
        voiceStopFallbackRunnable = null;
    }

    private boolean isVoiceSessionActive(long sessionId) {
        return voiceInputHeld
                && !voiceCancelRequested
                && voiceSessionId == sessionId
                && SystemClock.elapsedRealtime() - voiceStartedAtMillis < VOICE_MAX_DURATION_MILLIS;
    }

    private void startVoiceRecognition() {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(
                    new String[]{Manifest.permission.RECORD_AUDIO},
                    VOICE_PERMISSION_REQUEST_CODE
            );
            return;
        }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            callJavaScript("window.onNativeVoiceError && window.onNativeVoiceError(12)");
            return;
        }

        cancelVoiceRestart();
        cancelVoiceLimit();
        cancelVoiceStopFallback();
        releaseSpeechRecognizer();
        voiceSessionId += 1L;
        voiceStartedAtMillis = SystemClock.elapsedRealtime();
        voiceRestartAttempt = 0;
        voiceInputHeld = true;
        voiceCancelRequested = false;
        voiceTranscript.setLength(0);
        voiceLatestPartial = "";
        final long sessionId = voiceSessionId;
        beginVoiceRecognitionSegment(sessionId);
        if (webView != null) {
            voiceLimitRunnable = () -> {
                voiceLimitRunnable = null;
                if (voiceSessionId != sessionId || !voiceInputHeld || voiceCancelRequested) {
                    return;
                }
                finishVoiceInputAfterRelease(sessionId);
            };
            webView.postDelayed(voiceLimitRunnable, VOICE_MAX_DURATION_MILLIS);
        }
    }

    private boolean isCurrentVoiceRecognizer(
            SpeechRecognizer recognizer,
            int generation,
            long sessionId
    ) {
        return speechRecognizer == recognizer
                && voiceRecognizerGeneration == generation
                && voiceSessionId == sessionId;
    }

    private String appendVoiceSegment(String value) {
        String segment = value == null ? "" : value.trim();
        if (segment.isEmpty()) {
            return voiceTranscript.toString();
        }
        String existing = voiceTranscript.toString();
        if (existing.isEmpty()) {
            voiceTranscript.append(segment);
            return voiceTranscript.toString();
        }
        if (existing.endsWith(segment)) {
            return existing;
        }
        if (segment.startsWith(existing)) {
            voiceTranscript.append(segment.substring(existing.length()));
            return voiceTranscript.toString();
        }
        int overlap = 0;
        int maximumOverlap = Math.min(existing.length(), segment.length());
        for (int length = maximumOverlap; length > 0; length -= 1) {
            if (existing.regionMatches(existing.length() - length, segment, 0, length)) {
                overlap = length;
                break;
            }
        }
        String suffix = segment.substring(overlap);
        if (!suffix.isEmpty()) {
            char tail = existing.charAt(existing.length() - 1);
            if (overlap == 0 && "，。！？；、,.!?; ".indexOf(tail) < 0) {
                voiceTranscript.append('，');
            }
            voiceTranscript.append(suffix);
        }
        return voiceTranscript.toString();
    }

    private String commitLatestVoicePartial() {
        String partial = voiceLatestPartial;
        voiceLatestPartial = "";
        return appendVoiceSegment(partial);
    }

    private String voicePreviewWith(String partial) {
        String committed = voiceTranscript.toString();
        String current = partial == null ? "" : partial.trim();
        if (committed.isEmpty()) {
            return current;
        }
        if (current.isEmpty() || committed.endsWith(current)) {
            return committed;
        }
        return committed + current;
    }

    private void deliverVoiceResult(String result) {
        String value = result == null ? "" : result.trim();
        if (value.isEmpty()) {
            callJavaScript("window.onNativeVoiceError && window.onNativeVoiceError(7)");
        } else {
            callJavaScript("window.onNativeVoiceResult(" + JSONObject.quote(value) + ")");
        }
    }

    private void deliverVoiceResultOnce(long sessionId, String result) {
        if (voiceSessionId != sessionId
                || voiceDeliveredSessionId == sessionId
                || voiceCancelRequested) {
            return;
        }
        voiceDeliveredSessionId = sessionId;
        voiceInputHeld = false;
        cancelVoiceRestart();
        cancelVoiceLimit();
        cancelVoiceStopFallback();
        releaseSpeechRecognizer();
        deliverVoiceResult(result);
    }

    private void scheduleVoiceStopFallback(long sessionId) {
        if (webView == null || voiceSessionId != sessionId || voiceCancelRequested) {
            return;
        }
        cancelVoiceStopFallback();
        voiceStopFallbackRunnable = () -> {
            voiceStopFallbackRunnable = null;
            if (voiceSessionId != sessionId
                    || voiceDeliveredSessionId == sessionId
                    || voiceCancelRequested) {
                return;
            }
            deliverVoiceResultOnce(sessionId, commitLatestVoicePartial());
        };
        webView.postDelayed(voiceStopFallbackRunnable, VOICE_STOP_FALLBACK_MILLIS);
    }

    private void finishVoiceInputAfterRelease(long sessionId) {
        if (voiceSessionId != sessionId
                || voiceDeliveredSessionId == sessionId
                || voiceCancelRequested) {
            return;
        }
        voiceInputHeld = false;
        cancelVoiceRestart();
        cancelVoiceLimit();
        if (speechRecognizer == null) {
            deliverVoiceResultOnce(sessionId, commitLatestVoicePartial());
            return;
        }
        callJavaScript("window.onNativeVoiceProcessing && window.onNativeVoiceProcessing()");
        try {
            speechRecognizer.stopListening();
            scheduleVoiceStopFallback(sessionId);
        } catch (RuntimeException error) {
            deliverVoiceResultOnce(sessionId, commitLatestVoicePartial());
        }
    }

    private boolean shouldRetryVoiceError(int error) {
        return error == SpeechRecognizer.ERROR_NETWORK_TIMEOUT
                || error == SpeechRecognizer.ERROR_NETWORK
                || error == SpeechRecognizer.ERROR_AUDIO
                || error == SpeechRecognizer.ERROR_SERVER
                || error == SpeechRecognizer.ERROR_CLIENT
                || error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT
                || error == SpeechRecognizer.ERROR_NO_MATCH
                || error == SpeechRecognizer.ERROR_RECOGNIZER_BUSY
                || error == SpeechRecognizer.ERROR_TOO_MANY_REQUESTS
                || error == SpeechRecognizer.ERROR_SERVER_DISCONNECTED;
    }

    private void scheduleVoiceRestart(long sessionId, int error) {
        if (webView == null || !isVoiceSessionActive(sessionId)) {
            return;
        }
        cancelVoiceRestart();
        long elapsed = SystemClock.elapsedRealtime() - voiceStartedAtMillis;
        long remaining = VOICE_MAX_DURATION_MILLIS - elapsed;
        if (remaining <= 0L) {
            voiceInputHeld = false;
            deliverVoiceResultOnce(sessionId, commitLatestVoicePartial());
            return;
        }
        int attempt = Math.min(voiceRestartAttempt, 4);
        voiceRestartAttempt = Math.min(voiceRestartAttempt + 1, 5);
        long delay = VOICE_RESTART_DELAY_MILLIS * (1L << Math.min(attempt, 2));
        if (error == SpeechRecognizer.ERROR_CLIENT
                || error == SpeechRecognizer.ERROR_AUDIO
                || error == SpeechRecognizer.ERROR_SERVER_DISCONNECTED) {
            delay = Math.min(delay * 2L, 1_800L);
        }
        delay = Math.min(delay, Math.max(120L, remaining - 1L));
        voiceRestartRunnable = () -> {
            voiceRestartRunnable = null;
            if (isVoiceSessionActive(sessionId)) {
                beginVoiceRecognitionSegment(sessionId);
            }
        };
        webView.postDelayed(voiceRestartRunnable, delay);
    }

    private void beginVoiceRecognitionSegment(long sessionId) {
        if (!isVoiceSessionActive(sessionId)) {
            return;
        }
        SpeechRecognizer recognizer = speechRecognizer;
        if (recognizer == null) {
            final SpeechRecognizer created = SpeechRecognizer.createSpeechRecognizer(this);
            speechRecognizer = created;
            final int generation = voiceRecognizerGeneration;
            created.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle params) {
                if (!isCurrentVoiceRecognizer(created, generation, sessionId)) return;
                callJavaScript("window.onNativeVoiceReady && window.onNativeVoiceReady()");
            }

            @Override
            public void onBeginningOfSpeech() {
                if (!isCurrentVoiceRecognizer(created, generation, sessionId)) return;
                voiceRestartAttempt = 0;
                callJavaScript("window.onNativeVoiceBeginning && window.onNativeVoiceBeginning()");
            }

            @Override
            public void onRmsChanged(float rmsdB) {
                if (!isCurrentVoiceRecognizer(created, generation, sessionId)) return;
                callJavaScript("window.onNativeVoiceLevel && window.onNativeVoiceLevel("
                        + Math.max(-2f, Math.min(12f, rmsdB)) + ")");
            }

            @Override
            public void onBufferReceived(byte[] buffer) {
            }

            @Override
            public void onEndOfSpeech() {
                if (!isCurrentVoiceRecognizer(created, generation, sessionId)) return;
                callJavaScript("window.onNativeVoiceProcessing && window.onNativeVoiceProcessing()");
            }

            @Override
            public void onError(int error) {
                if (!isCurrentVoiceRecognizer(created, generation, sessionId)) return;
                boolean cancelled = voiceCancelRequested;
                boolean releasedByUser = !voiceInputHeld;
                String collected = commitLatestVoicePartial();
                if (cancelled) {
                    releaseSpeechRecognizer();
                    return;
                }
                if (isVoiceSessionActive(sessionId) && shouldRetryVoiceError(error)) {
                    if (error == SpeechRecognizer.ERROR_CLIENT
                            || error == SpeechRecognizer.ERROR_AUDIO
                            || error == SpeechRecognizer.ERROR_SERVER_DISCONNECTED) {
                        releaseSpeechRecognizer();
                    }
                    scheduleVoiceRestart(sessionId, error);
                    return;
                }
                if (releasedByUser) {
                    deliverVoiceResultOnce(sessionId, collected);
                    return;
                }
                voiceInputHeld = false;
                cancelVoiceLimit();
                if (!collected.isEmpty()) {
                    deliverVoiceResultOnce(sessionId, collected);
                    return;
                }
                releaseSpeechRecognizer();
                callJavaScript("window.onNativeVoiceError && window.onNativeVoiceError("
                        + error + ")");
            }

            @Override
            public void onResults(Bundle results) {
                if (!isCurrentVoiceRecognizer(created, generation, sessionId)) return;
                String result = firstRecognitionResult(results);
                String collected = result.isEmpty()
                        ? commitLatestVoicePartial()
                        : appendVoiceSegment(result);
                voiceLatestPartial = "";
                if (voiceCancelRequested) {
                    releaseSpeechRecognizer();
                    return;
                }
                if (isVoiceSessionActive(sessionId)) {
                    voiceRestartAttempt = result.isEmpty() ? voiceRestartAttempt : 0;
                    if (!collected.isEmpty()) {
                        callJavaScript("window.onNativeVoicePartial("
                                + JSONObject.quote(collected) + ")");
                    }
                    scheduleVoiceRestart(sessionId, 0);
                    return;
                }
                cancelVoiceLimit();
                deliverVoiceResultOnce(sessionId, collected);
            }

            @Override
            public void onPartialResults(Bundle partialResults) {
                if (!isCurrentVoiceRecognizer(created, generation, sessionId)) return;
                String partial = firstRecognitionResult(partialResults);
                if (!partial.isEmpty() && !voiceCancelRequested) {
                    voiceLatestPartial = partial;
                    callJavaScript("window.onNativeVoicePartial("
                            + JSONObject.quote(voicePreviewWith(partial)) + ")");
                }
            }

            @Override
            public void onSegmentResults(Bundle segmentResults) {
                if (!isCurrentVoiceRecognizer(created, generation, sessionId)) return;
                String segment = firstRecognitionResult(segmentResults);
                String collected = appendVoiceSegment(segment);
                voiceLatestPartial = "";
                if (!collected.isEmpty() && !voiceCancelRequested) {
                    callJavaScript("window.onNativeVoicePartial("
                            + JSONObject.quote(collected) + ")");
                }
            }

            @Override
            public void onEndOfSegmentedSession() {
                if (!isCurrentVoiceRecognizer(created, generation, sessionId)) return;
                String collected = commitLatestVoicePartial();
                if (voiceCancelRequested) {
                    releaseSpeechRecognizer();
                    return;
                }
                if (isVoiceSessionActive(sessionId)) {
                    scheduleVoiceRestart(sessionId, 0);
                } else {
                    cancelVoiceLimit();
                    deliverVoiceResultOnce(sessionId, collected);
                }
            }

            @Override
            public void onEvent(int eventType, Bundle params) {
            }
            });
            recognizer = created;
        }

        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(
                RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM
        );
        intent.putExtra(
                RecognizerIntent.EXTRA_LANGUAGE,
                Locale.SIMPLIFIED_CHINESE.toLanguageTag()
        );
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.putExtra(
                    RecognizerIntent.EXTRA_SEGMENTED_SESSION,
                    RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS
            );
        }
        intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 60_000L);
        intent.putExtra(
                RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS,
                12_000L
        );
        intent.putExtra(
                RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS,
                18_000L
        );
        try {
            recognizer.startListening(intent);
        } catch (RuntimeException error) {
            releaseSpeechRecognizer();
            if (isVoiceSessionActive(sessionId)) {
                scheduleVoiceRestart(sessionId, SpeechRecognizer.ERROR_CLIENT);
            } else {
                voiceInputHeld = false;
                cancelVoiceLimit();
                callJavaScript("window.onNativeVoiceError && window.onNativeVoiceError(5)");
            }
        }
    }

    public static void ensureNotificationChannel(Context context) {
        NotificationManager manager = context.getSystemService(NotificationManager.class);
        if (manager == null) {
            return;
        }
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                context.getString(R.string.notification_channel_name),
                NotificationManager.IMPORTANCE_MAX
        );
        channel.setDescription(context.getString(R.string.notification_channel_description));
        Uri soundUri = Uri.parse(
                ContentResolver.SCHEME_ANDROID_RESOURCE
                        + "://" + context.getPackageName()
                        + "/" + R.raw.reminder_e
        );
        AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build();
        channel.setSound(soundUri, audioAttributes);
        channel.enableVibration(true);
        channel.setVibrationPattern(new long[]{0L, 320L, 140L, 320L, 140L, 520L});
        channel.enableLights(true);
        channel.setShowBadge(true);
        channel.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
        if (manager.isNotificationPolicyAccessGranted()) {
            channel.setBypassDnd(true);
        }
        manager.createNotificationChannel(channel);
    }

    private void initializeInteractionFeedback() {
        AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build();
        interactionSoundPool = new SoundPool.Builder()
                .setMaxStreams(4)
                .setAudioAttributes(audioAttributes)
                .build();
        interactionSoundPool.setOnLoadCompleteListener((soundPool, sampleId, status) -> {
            if (status == 0) {
                loadedInteractionSoundIds.add(sampleId);
            }
        });
        registerInteractionSound("tick_1", R.raw.interaction_general);
        registerInteractionSound("tick_2", R.raw.interaction_general);
        registerInteractionSound("tick_3", R.raw.interaction_general);
        registerInteractionSound("soft", R.raw.interaction_general);
        registerInteractionSound("confirm", R.raw.interaction_general);
        registerInteractionSound("send", R.raw.interaction_general);
        registerInteractionSound("bubble", R.raw.interaction_water_drop);
        registerInteractionSound("wheel_tick", R.raw.interaction_wheel_tick);
        registerInteractionSound("reject", R.raw.interaction_general);
        registerInteractionSound("heavy", R.raw.interaction_delete);
        registerInteractionSound("voice", R.raw.interaction_general);
    }

    private void registerInteractionSound(String key, int resourceId) {
        interactionSoundResources.put(key, resourceId);
        interactionSoundIds.put(key, interactionSoundPool.load(this, resourceId, 1));
    }

    private void releaseInteractionFallbackPlayer() {
        MediaPlayer player = interactionFallbackPlayer;
        interactionFallbackPlayer = null;
        if (player != null) {
            try {
                player.release();
            } catch (RuntimeException ignored) {
            }
        }
    }

    private void playInteractionFallback(String soundKey) {
        Integer resourceId = interactionSoundResources.get(soundKey);
        if (resourceId == null) {
            resourceId = interactionSoundResources.get("tick_1");
        }
        if (resourceId == null) {
            return;
        }
        releaseInteractionFallbackPlayer();
        AudioAttributes attributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build();
        MediaPlayer player = MediaPlayer.create(
                this,
                resourceId,
                attributes,
                AudioManager.AUDIO_SESSION_ID_GENERATE
        );
        if (player == null) {
            return;
        }
        interactionFallbackPlayer = player;
        player.setVolume(0.78f, 0.78f);
        player.setOnCompletionListener(completed -> {
            if (interactionFallbackPlayer == completed) {
                interactionFallbackPlayer = null;
            }
            completed.release();
        });
        player.setOnErrorListener((failed, what, extra) -> {
            if (interactionFallbackPlayer == failed) {
                interactionFallbackPlayer = null;
            }
            failed.release();
            return true;
        });
        player.start();
    }

    private void playBuiltInInteractionSound(String kind) {
        if (interactionSoundPool == null) {
            return;
        }
        String soundKey = kind;
        if ("tick".equals(kind)) {
            interactionTickIndex = (interactionTickIndex % 3) + 1;
            soundKey = "tick_" + interactionTickIndex;
        }
        Integer soundId = interactionSoundIds.get(soundKey);
        if (soundId == null) {
            soundId = interactionSoundIds.get("tick_1");
        }
        if (soundId != null && loadedInteractionSoundIds.contains(soundId)) {
            int streamId = interactionSoundPool.play(soundId, 0.72f, 0.72f, 1, 0, 1f);
            if (streamId != 0) {
                return;
            }
        }
        playInteractionFallback(soundKey);
    }

    private void releaseWheelLoopPlayer() {
        if (wheelLoopVolumeAnimator != null) {
            wheelLoopVolumeAnimator.cancel();
            wheelLoopVolumeAnimator = null;
        }
        MediaPlayer player = wheelLoopPlayer;
        wheelLoopPlayer = null;
        wheelLoopVolume = 0f;
        if (player != null) {
            try {
                player.release();
            } catch (RuntimeException ignored) {
            }
        }
    }

    private void setWheelLoopVolume(float volume) {
        wheelLoopVolume = Math.max(0f, Math.min(1f, volume));
        if (wheelLoopPlayer != null) {
            wheelLoopPlayer.setVolume(wheelLoopVolume, wheelLoopVolume);
        }
    }

    private void animateWheelLoopVolume(float target, long duration, boolean releaseWhenSilent) {
        if (wheelLoopPlayer == null) {
            return;
        }
        if (wheelLoopVolumeAnimator != null) {
            wheelLoopVolumeAnimator.cancel();
        }
        ValueAnimator animator = ValueAnimator.ofFloat(wheelLoopVolume, target);
        wheelLoopVolumeAnimator = animator;
        animator.setDuration(duration);
        animator.addUpdateListener(value -> setWheelLoopVolume((float) value.getAnimatedValue()));
        animator.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                if (wheelLoopVolumeAnimator != animation) {
                    return;
                }
                wheelLoopVolumeAnimator = null;
                if (releaseWhenSilent && target <= 0f) {
                    releaseWheelLoopPlayer();
                }
            }
        });
        animator.start();
    }

    private void startWheelLoopSound() {
        if (wheelLoopPlayer == null) {
            AudioAttributes attributes = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build();
            MediaPlayer player = MediaPlayer.create(
                    this,
                    R.raw.interaction_wheel_loop,
                    attributes,
                    AudioManager.AUDIO_SESSION_ID_GENERATE
            );
            if (player == null) {
                return;
            }
            wheelLoopPlayer = player;
            player.setLooping(true);
            setWheelLoopVolume(0f);
            player.start();
        }
        animateWheelLoopVolume(0.46f, 70L, false);
    }

    private void stopWheelLoopSound() {
        animateWheelLoopVolume(0f, 120L, true);
    }

    private void vibrateInteraction(String kind) {
        VibratorManager vibratorManager = getSystemService(VibratorManager.class);
        if (vibratorManager == null) {
            return;
        }
        Vibrator vibrator = vibratorManager.getDefaultVibrator();
        if (!vibrator.hasVibrator()) {
            return;
        }

        long[] timings;
        int[] amplitudes;
        switch (kind == null ? "" : kind) {
            case "send":
            case "bubble":
                timings = new long[]{0L, 13L, 30L, 16L};
                amplitudes = new int[]{0, 34, 0, 48};
                break;
            case "confirm":
                timings = new long[]{0L, 15L, 34L, 18L};
                amplitudes = new int[]{0, 38, 0, 52};
                break;
            case "reject":
                timings = new long[]{0L, 22L};
                amplitudes = new int[]{0, 55};
                break;
            case "heavy":
                timings = new long[]{0L, 25L};
                amplitudes = new int[]{0, 62};
                break;
            case "voice":
                timings = new long[]{0L, 18L};
                amplitudes = new int[]{0, 45};
                break;
            case "soft":
                timings = new long[]{0L, 14L};
                amplitudes = new int[]{0, 34};
                break;
            default:
                timings = new long[]{0L, 9L};
                amplitudes = new int[]{0, 25};
                break;
        }
        vibrator.vibrate(VibrationEffect.createWaveform(timings, amplitudes, -1));
    }

    private int surfaceColorFor(String theme, boolean dark) {
        if (dark) {
            return Color.rgb(42, 32, 40);
        }
        switch (theme == null ? "dusk" : theme) {
            case "mist": return Color.rgb(211, 232, 246);
            case "warm": return Color.rgb(240, 222, 204);
            case "sage": return Color.rgb(213, 231, 217);
            case "sea": return Color.rgb(207, 225, 239);
            case "amber": return Color.rgb(243, 224, 204);
            case "rose": return Color.rgb(240, 215, 226);
            case "aurora": return Color.rgb(224, 214, 240);
            case "sand": return Color.rgb(239, 226, 205);
            case "deep": return Color.rgb(214, 223, 232);
            case "cedar": return Color.rgb(214, 229, 222);
            case "moon": return Color.rgb(218, 218, 238);
            case "dusk":
            default: return Color.rgb(222, 214, 226);
        }
    }

    private int storedLaunchSurfaceColor() {
        return surfaceColorFor(
                getSharedPreferences(PREFERENCES_NAME, MODE_PRIVATE)
                        .getString(LAUNCH_THEME_PREFERENCE, "dusk"),
                getSharedPreferences(PREFERENCES_NAME, MODE_PRIVATE)
                        .getBoolean(LAUNCH_DARK_PREFERENCE, false)
        );
    }

    private void applySystemAppearance(int surfaceColor, boolean dark) {
        getWindow().setStatusBarColor(surfaceColor);
        getWindow().setNavigationBarColor(surfaceColor);
        if (webView != null) {
            webView.setBackgroundColor(surfaceColor);
        }
        WindowInsetsController controller = getWindow().getInsetsController();
        if (controller != null) {
            int lightBars = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                    | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
            controller.setSystemBarsAppearance(dark ? 0 : lightBars, lightBars);
        }
    }

    private void openNotificationSettingsFromActivity() {
        Intent intent = new Intent(Settings.ACTION_CHANNEL_NOTIFICATION_SETTINGS);
        intent.putExtra(Settings.EXTRA_APP_PACKAGE, getPackageName());
        intent.putExtra(Settings.EXTRA_CHANNEL_ID, CHANNEL_ID);
        startActivity(intent);
    }

    private PendingIntent reminderPendingIntent(String id, String text) {
        Intent intent = new Intent(this, ReminderReceiver.class);
        intent.setAction("app.weijin.notes.REMIND");
        intent.putExtra("reminder_id", id);
        intent.putExtra("reminder_text", text);
        return PendingIntent.getBroadcast(
                this,
                id.hashCode(),
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    private PendingIntent reminderShowPendingIntent(String id) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        return PendingIntent.getActivity(
                this,
                id.hashCode() ^ 0x4d2,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    public final class AndroidBridge {
        @JavascriptInterface
        public String getPlatform() {
            return "android";
        }

        @JavascriptInterface
        public void setSystemAppearance(boolean dark) {
            String theme = getSharedPreferences(PREFERENCES_NAME, MODE_PRIVATE)
                    .getString(LAUNCH_THEME_PREFERENCE, "dusk");
            runOnUiThread(() -> applySystemAppearance(surfaceColorFor(theme, dark), dark));
        }

        @JavascriptInterface
        public void setLaunchAppearance(String theme, boolean dark) {
            getSharedPreferences(PREFERENCES_NAME, MODE_PRIVATE)
                    .edit()
                    .putString(LAUNCH_THEME_PREFERENCE, theme == null ? "dusk" : theme)
                    .putBoolean(LAUNCH_DARK_PREFERENCE, dark)
                    .apply();
            runOnUiThread(() -> applySystemAppearance(surfaceColorFor(theme, dark), dark));
        }

        @JavascriptInterface
        public void startVoiceInput() {
            runOnUiThread(MainActivity.this::startVoiceRecognition);
        }

        @JavascriptInterface
        public void stopVoiceInput() {
            runOnUiThread(() -> {
                finishVoiceInputAfterRelease(voiceSessionId);
            });
        }

        @JavascriptInterface
        public void cancelVoiceInput() {
            runOnUiThread(() -> {
                voiceInputHeld = false;
                voiceCancelRequested = true;
                voiceSessionId += 1L;
                cancelVoiceRestart();
                cancelVoiceLimit();
                cancelVoiceStopFallback();
                voiceLatestPartial = "";
                if (speechRecognizer != null) {
                    speechRecognizer.cancel();
                }
                releaseSpeechRecognizer();
                callJavaScript(
                        "window.onNativeVoiceCancelled && window.onNativeVoiceCancelled()"
                );
            });
        }

        @JavascriptInterface
        public void playInteractionFeedback(String kind, boolean withSound) {
            runOnUiThread(() -> {
                vibrateInteraction(kind);
                if (withSound) {
                    playBuiltInInteractionSound(kind);
                }
            });
        }

        @JavascriptInterface
        public void startWheelFeedback() {
            runOnUiThread(MainActivity.this::startWheelLoopSound);
        }

        @JavascriptInterface
        public void stopWheelFeedback() {
            runOnUiThread(MainActivity.this::stopWheelLoopSound);
        }

        @JavascriptInterface
        public void scheduleReminder(String id, String text, long triggerAtMillis) {
            runOnUiThread(() -> {
                AlarmManager alarmManager = getSystemService(AlarmManager.class);
                if (alarmManager == null) {
                    callJavaScript("window.onNativeReminderError && window.onNativeReminderError()");
                    return;
                }
                long safeTrigger = Math.max(System.currentTimeMillis() + 1000L, triggerAtMillis);
                try {
                    AlarmManager.AlarmClockInfo alarmClockInfo =
                            new AlarmManager.AlarmClockInfo(
                                    safeTrigger,
                                    reminderShowPendingIntent(id)
                            );
                    alarmManager.setAlarmClock(
                            alarmClockInfo,
                            reminderPendingIntent(id, text)
                    );
                } catch (SecurityException error) {
                    alarmManager.setExactAndAllowWhileIdle(
                            AlarmManager.RTC_WAKEUP,
                            safeTrigger,
                            reminderPendingIntent(id, text)
                    );
                    callJavaScript(
                            "window.onNativeReminderFallback && window.onNativeReminderFallback()"
                    );
                }
            });
        }

        @JavascriptInterface
        public void cancelReminder(String id) {
            runOnUiThread(() -> {
                AlarmManager alarmManager = getSystemService(AlarmManager.class);
                if (alarmManager != null) {
                    alarmManager.cancel(reminderPendingIntent(id, ""));
                }
            });
        }

        @JavascriptInterface
        public void openNotificationSettings() {
            runOnUiThread(MainActivity.this::openNotificationSettingsFromActivity);
        }
    }

    @Override
    protected void onPause() {
        releaseWheelLoopPlayer();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        voiceInputHeld = false;
        voiceSessionId += 1L;
        cancelVoiceRestart();
        cancelVoiceLimit();
        cancelVoiceStopFallback();
        releaseSpeechRecognizer();
        if (interactionSoundPool != null) {
            interactionSoundPool.release();
            interactionSoundPool = null;
        }
        releaseInteractionFallbackPlayer();
        releaseWheelLoopPlayer();
        interactionSoundIds.clear();
        interactionSoundResources.clear();
        loadedInteractionSoundIds.clear();
        if (imageChooserCallback != null) {
            imageChooserCallback.onReceiveValue(null);
            imageChooserCallback = null;
        }
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
