import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.stage.Stage;
import javafx.util.Duration;
import org.java-websocket.client.WebSocketClient;
import org.java-websocket.handshake.ClientHandshake;
import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;

public class CrashGameApp extends Application {

    private ArrayList<Double> crashValues = new ArrayList<>();
    private int currentIndex = 0;
    private Label crashValueLabel;
    private WebSocketClient webSocketClient;

    @Override
    public void start(Stage primaryStage) {
        // إعداد واجهة المستخدم
        StackPane root = new StackPane();
        crashValueLabel = new Label("0.00");
        crashValueLabel.setTextFill(Color.WHITE);
        crashValueLabel.setFont(Font.font("Arial", 72));

        root.getChildren().add(crashValueLabel);

        Scene scene = new Scene(root, 600, 400, Color.BLACK);
        primaryStage.setTitle("Crash Game");
        primaryStage.setScene(scene);
        primaryStage.show();

        // إعداد WebSocket
        try {
            connectWebSocket();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

        // تحديث القيمة كل 1 ثانية
        Timeline timeline = new Timeline(new KeyFrame(Duration.seconds(1), e -> updateCrashValue()));
        timeline.setCycleCount(Timeline.INDEFINITE);
        timeline.play();
    }

    private void connectWebSocket() throws URISyntaxException {
        // استبدل الرابط الخاص بك هنا
        String webSocketUrl = "wss://1xbet.com/games-frame/sockets/crash?whence=50&fcountry=8&ref=1&gr=70&appGuid=games-web-master&lng=ar&access_token=eyJhbGciOiJFUzI1NiIsImtpZCI6IjEiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiI1MC82OTI5MTkxNTUiLCJwaWQiOiIxIiwianRpIjoiMC9lZTQ4NDAyMDQ2MWE4MzJjYjIwNDE4YmY4MzYwYWRmYmUxNWE5ZGMzOGMxNjU5MzVjZWIxNGMxOTQxNmU0ZDRjIiwiYXBwIjoiTkEiLCJpbm5lciI6InRydWUiLCJuYmYiOjE3MzQzODY4NDAsImV4cCI6MTczNDQwMTI0MCwiaWF0IjoxNzM0Mzg2ODQwfQ.4dAT_0JJwQkBgBOu7P69sRL6LkDJ_2RKeRh1tqYUm-q1PJXs0s4Rj8TvXN4GF6WKa2JHdZKfUZnZKUjEokffzw";
        URI uri = new URI(webSocketUrl);

        webSocketClient = new WebSocketClient(uri) {
            @Override
            public void onOpen(ClientHandshake handshakedata) {
                System.out.println("WebSocket opened");
                sendMessage("{\"protocol\":\"json\",\"version\":1}\x1e");
                sendMessage("{\"arguments\":[{\"activity\":30,\"account\":692919155}],\"invocationId\":\"0\",\"target\":\"Account\",\"type\":1}\x1e");
            }

            @Override
            public void onMessage(String message) {
                try {
                    JSONObject jsonObject = new JSONObject(message);
                    if (jsonObject.has("target") && jsonObject.getString("target").equals("OnCrash")) {
                        JSONArray arguments = jsonObject.getJSONArray("arguments");
                        double crashValue = arguments.getJSONObject(0).getDouble("f");
                        crashValues.add(crashValue);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onClose(int code, String reason, boolean remote) {
                System.out.println("WebSocket closed: " + reason);
            }

            @Override
            public void onError(Exception ex) {
                ex.printStackTrace();
            }
        };

        webSocketClient.connect();
    }

    private void updateCrashValue() {
        if (currentIndex < crashValues.size()) {
            double value = crashValues.get(currentIndex);
            crashValueLabel.setText(String.format("%.2f", value));
            currentIndex++;
        }
    }

    public static void main(String[] args) {
        launch(args);
    }
}
