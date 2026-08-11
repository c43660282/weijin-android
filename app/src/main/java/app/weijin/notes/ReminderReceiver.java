package app.weijin.notes;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;

public class ReminderReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        String id = intent.getStringExtra("reminder_id");
        String text = intent.getStringExtra("reminder_text");
        if (id == null) {
            id = String.valueOf(System.currentTimeMillis());
        }
        if (text == null || text.trim().isEmpty()) {
            text = "有一件事需要处理";
        }

        NotificationManager manager = context.getSystemService(NotificationManager.class);
        if (manager == null) {
            return;
        }
        MainActivity.ensureNotificationChannel(context);

        Intent openIntent = new Intent(context, MainActivity.class);
        openIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent openPendingIntent = PendingIntent.getActivity(
                context,
                id.hashCode(),
                openIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification notification = new Notification.Builder(context, MainActivity.CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(context.getString(R.string.app_name))
                .setContentText(text)
                .setStyle(new Notification.BigTextStyle().bigText(text))
                .setContentIntent(openPendingIntent)
                .setAutoCancel(true)
                .setCategory(Notification.CATEGORY_ALARM)
                .setPriority(Notification.PRIORITY_MAX)
                .setVibrate(new long[]{0L, 320L, 140L, 320L, 140L, 520L})
                .setWhen(System.currentTimeMillis())
                .setShowWhen(true)
                .setOnlyAlertOnce(false)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .build();
        manager.notify(id.hashCode(), notification);
    }
}
