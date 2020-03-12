echo off
mode con: cols=85 lines=50
set ch=data\chgcolor.exe
set fast=data\fastboot.exe
set adb=data\adb.exe
echo. && echo. && echo.
%ch% cc
echo   ___________________________________________________________________________________
%ch% 00
echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo.
echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo.
%ch% 0f
echo			             MiWatchKleaner 1.0
%ch% 00
echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo.
echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo.
%ch% cc
echo   ___________________________________________________________________________________
%ch% 0f
Timeout /t 2 >data/null

:START
cls
%ch% 07
echo. && echo. && echo.
%ch% cc
echo   ___________________________________________________________________________________
%ch% 0f
echo. && echo. && echo.
echo                            MiWatchKleaner 1.0
echo.
echo                                    --   MENU  --
echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo.
Timeout /t 1 >data/null
echo   _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    1 - Remove Installed Xiaomi Apps
echo.
%ch% 08
%ch% 0f
echo  _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    2 - Install Google Apps
echo.
%ch% 08
%ch% 0f
echo   _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    3 - Connect to MiWatch via Wifi
echo.
%ch% 08
%ch% 0f
echo   _________________________________________________________________________________
echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo.
echo                                                                            E - exit
%ch% cc
echo   ___________________________________________________________________________________
%ch% 0f
Timeout /t 1 >data/null
echo  Choose an option:
%ch% 00
echo. && choice /c:1234E /M ""

    IF %ERRORLEVEL% == 1 GOTO REMOVEAPPS
	IF %ERRORLEVEL% == 2 GOTO INSTALLAPPS
	IF %ERRORLEVEL% == 3 GOTO STATUS
	IF %ERRORLEVEL% == 5 GOTO EXIT
	
:EXIT
exit

:REMOVEAPPS
cls
%ch% 07
echo. && echo. && echo.
%ch% cc
echo   ___________________________________________________________________________________
%ch% 0f
echo. && echo. && echo.
echo.
echo                        --   REMOVE XIAOMI APPS MENU  --
echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo.
Timeout /t 1 >data/null
echo   _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    1 - Remove Xiaomi Apps and Overlays
echo.
%ch% 08
%ch% 0f
echo  _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    2 - Retrun to Main Menu
echo.
%ch% 08
%ch% 0f
echo   _________________________________________________________________________________
echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo.
echo                                                                            E - exit
%ch% cc
echo   ___________________________________________________________________________________
%ch% 0f
Timeout /t 1 >data/null
echo  Choose an option:
%ch% 00
echo. && choice /c:123 /M ""

    IF %ERRORLEVEL% == 1 GOTO REMOVEAPP
	IF %ERRORLEVEL% == 2 GOTO START
	
:EXIT
exit

:INSTALLAPPS
cls
%ch% 07
echo. && echo. && echo.
%ch% cc
echo   ___________________________________________________________________________________
%ch% 0f
echo. && echo. && echo.
echo.
echo                      --   INSTALL APPS  --
echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo.
Timeout /t 1 >data/null
echo   _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    1 - INSTALL Google Apps
echo.
%ch% 08
%ch% 0f
echo  _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    2 - INSTALL Other Apps
echo.
%ch% 08
%ch% 0f
echo   _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    3 - Retrun to Main Menu
echo.
%ch% 08
%ch% 0f
echo   _________________________________________________________________________________
echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo.
echo                                                                            E - exit
%ch% cc
echo   ___________________________________________________________________________________
%ch% 0f
Timeout /t 1 >data/null
echo  Choose an option:
%ch% 00
echo. && choice /c:123 /M ""

    IF %ERRORLEVEL% == 1 GOTO GOOGLE
	IF %ERRORLEVEL% == 2 GOTO OTHERS
	IF %ERRORLEVEL% == 3 GOTO START
	
:EXIT
exit

:REMOVEAPP
cls
color 47
color 47
%adb% shell pm uninstall -k --user 0 com.xiaomi.wear.hotwordle && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.fitness && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.watchface.function && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.watchface.art && %adb% shell pm uninstall -k --user 0 com.xiaomi.account && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.watchface.album && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.watchface.decomposite && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.watchface.classic && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.tutorial && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.deskclock && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.sportlogger && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.weather && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.charging && %adb% shell pm uninstall -k --user 0 com.xiaomi.mihome && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.anonymous.xiaoai && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.lpa && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.market && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.setupprovider && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.xiaoai && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.card && %adb% shell pm uninstall -k --user 0 com.google.android.inputmethod.pinyin && %adb% shell pm uninstall -k --user 0 com.sogou.ime.wear
Timeout /t 10 >data/null
%ch% 4F
echo. ******** Apps Removed *****
Timeout /t 2 >data/null
echo.-----------------------------------------------------------------------------------
%ch% 47
Timeout /t 1 >data/null
echo.
echo                    Press any key to back to MAIN MEMU
%ch% 44
pause
%ch% 00
GOTO START

:STATUS
cls
color 47
set /p miwatchIp=Please enter MiWatch IP Address:
Timeout /t 5 >data/null
%ch% 4F
%adb% connect %miwatchIp%
Timeout /t 2 >data/null
%adb% devices
echo.-----------------------------------------------------------------------------------
%ch% 47
Timeout /t 1 >data/null
echo.
echo. && echo.
echo                    Press any key to back to MAIN MEMU
%ch% 44
pause
%ch% 00
GOTO START

:GOOGLE
cls
color 47
::%adb% shell content insert --uri content://settings/system --bind name:s:status_bar_show_battery_percent --bind value:i:1
Timeout /t 5 >data/null
%ch% 4F
echo. ******** Battery Percentage Enabled *****
Timeout /t 2 >data/null
echo.-----------------------------------------------------------------------------------
%ch% 47
Timeout /t 1 >data/null
echo.
echo                    Please reboot tablet to see changes
echo. && echo.
echo. && echo.
echo                    Press any key to back to MAIN MEMU
%ch% 44
pause
%ch% 00
GOTO START

:OTHERS
cls
color 47
echo. Downloading Latest Pujie Black
curl -o data/apps/
%adb% install data/apps/Pujie.apk
::%adb% shell content insert --uri content://settings/system --bind name:s:status_bar_show_battery_percent --bind value:i:0
Timeout /t 5 >data/null
%ch% 4F
echo. ******** Battery Percentage Disabled *****
Timeout /t 2 >data/null
echo.-----------------------------------------------------------------------------------
%ch% 47
Timeout /t 1 >data/null
echo.
echo                    Please reboot tablet to see changes
echo. && echo.
echo. && echo.
echo                    Press any key to back to MAIN MEMU
%ch% 44
pause
%ch% 00
GOTO START