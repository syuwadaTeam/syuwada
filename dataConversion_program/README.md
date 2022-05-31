# csvデータ変換プログラム

- c言語で作成


### 仕様

- makeCSVdata_programで収集したcsvデータを、機械学習の時に使える形式に変換し、2つのcsvファイルに分けて出力する。
- 入力はプログラム内で指定したファイル、出力は`converted_pointData_datax.csv``converted_pointData_datay.csv`の2つ。
- プログラムと同じ階層に`beforeConversionFiles`フォルダがあり、その中に変換前のcsvデータを置く。