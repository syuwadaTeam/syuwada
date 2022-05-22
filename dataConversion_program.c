/*

    csvから読み取り、Tensorflow.js機械学習用のcsvファイル二つに変換するプログラム。

    ファイル構成は、プログラムと同じ階層に読み込む用のcsvファイルも置いておくこと。

    /------------
        - dataConversion_program.c (このプログラム)
        - pointData_A_1.csv
        - pointData_A_2.csv
        - pointData_A_3.csv
        - ...（読み込み用csv）

*/


#include <stdio.h>

int main(void){

    FILE *fp_write_x = fopen("pointData_datax_1.csv", "w");     //出力用ファイル、dataxを作成。関節データのファイル。
    FILE *fp_write_y = fopen("pointData_datay_1.csv", "w");     //出力用ファイル、datayを作成。文字番号データのファイル。


    //読み込むファイル名一覧をあらかじめ書いておく。
    //ただし、ファイル名は日本語不可。
    const char readFileName[][30] = {   
                                "pointData_A_1.csv",
                                "pointData_A_2.csv",
                                "pointData_A_3.csv",
                                "pointData_A_4.csv",
                                "pointData_A_5.csv",
                                "pointData_B_1.csv",
                                "pointData_B_2.csv",
                                "pointData_B_3.csv",
                                "pointData_B_4.csv",
                                "pointData_C_1.csv",
                                "pointData_C_2.csv",
                                "pointData_C_3.csv",
                                "pointData_D_1.csv",
                                "pointData_D_2.csv",
                                "pointData_D_3.csv",

                            };


    //一つ一つファイルを読み込み変換、書き込み。
    for(int fileNum = 0; fileNum < sizeof(readFileName) / sizeof(readFileName[0]); fileNum++){

        FILE *fp_read;
        int charNum;
        char landmarks_str[1500];

        //ファイルを読み込む
        if ((fp_read = fopen(readFileName[fileNum], "r")) == NULL) {
            puts("error!! : cant open file");
            return 1;
        }


        //ファイルの最後まで一行ずつ読み込む
        while (fscanf(fp_read, "%d,%s", &charNum, landmarks_str) != EOF){

            //xに書き込み
            fprintf(fp_write_x, "%s\n", landmarks_str);

            //yに書き込み
            for(int i = 0; i < 45; i++)  fprintf(fp_write_y, "%d,", (i == charNum));
            fprintf(fp_write_y, "%d\n", (45 == charNum));

            //charNumだけ出力
            printf("charNum = %d\n", charNum);
        }

        puts("");
        fclose(fp_read);

    }


    puts("Successful conversion...\n\n");
    fclose(fp_write_x);
    fclose(fp_write_y);

    return 0;
}