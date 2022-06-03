# 手話打 指文字予測プログラム

- ver.β.1.3
- Glitch上で動作 → https://smoggy-shared-mile.glitch.me/


### 仕様

- カメラが必要。
- カメラに手をかざすと、認識が開始する。
- 左上に大きく、認識した文字が出力される。
- その下の`確率 = `はその文字の一致率が出力される。
- 一致率が一番大きかったものが認識した文字とされる。

- `https://raw.githubusercontent.com/syuwadaTeam/syuwada/main/yubimojiPrediction_program/Assets/model.json`より、学習したモデルを読み込み、カメラから読み込んだ関節データを分類する。