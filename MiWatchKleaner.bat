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
echo			             MiWatchKleaner 1.4
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
echo                            MiWatchKleaner 1.4
echo.
echo                                    --   MENU  --
echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo. && echo.
Timeout /t 1 >data/null
echo   _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    1 - Connect to MiWatch via Wifi
echo.
%ch% 08
%ch% 0f
echo  _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    2 - Remove Installed Xiaomi Apps
echo.
%ch% 08
%ch% 0f
echo   _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    3 - Install Compatible Apps
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
	
	IF %ERRORLEVEL% == 1 GOTO CONNECT
    IF %ERRORLEVEL% == 2 GOTO REMOVEAPPS
	IF %ERRORLEVEL% == 3 GOTO INSTALLAPPS
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
echo    (Google Fit, Google Maps, Google Quick Search,
echo      Google Translate, Google TTS, WearOs Keyboard)
echo.
%ch% 08
%ch% 0f
echo  _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    2 - INSTALL Other Apps
echo    (AccuWeather, Alberto Store, PujieBlack,
echo      Ultimate Alexa)
echo.
%ch% 08
%ch% 0f
echo   _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    3 - INSTALL MoreLocale
echo.    
%ch% 08
%ch% 0f
echo   _________________________________________________________________________________
echo. && echo.
%ch% 0a
echo    4 - Retrun to Main Menu
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
	IF %ERRORLEVEL% == 3 GOTO MORELOCALE
	IF %ERRORLEVEL% == 4 GOTO START
	
:EXIT
exit

:REMOVEAPP
cls
color 47
color 47
%adb% shell pm uninstall -k --user 0 com.ximalayaos.wear.common && %adb% shell pm uninstall -k --user 0 com.eg.android.AlipayGphone && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.hotwordle && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.fitness && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.watchface.function && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.watchface.art && %adb% shell pm uninstall -k --user 0 com.xiaomi.account && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.watchface.album && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.watchface.decomposite && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.watchface.classic && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.tutorial && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.deskclock && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.sportlogger && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.weather && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.charging && %adb% shell pm uninstall -k --user 0 com.xiaomi.mihome && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.anonymous.xiaoai && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.lpa && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.market && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.setupprovider && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.xiaoai && %adb% shell pm uninstall -k --user 0 com.xiaomi.wear.card && %adb% shell pm uninstall -k --user 0 com.google.android.inputmethod.pinyin && %adb% shell pm uninstall -k --user 0 com.sogou.ime.wear &&  %adb% shell pm uninstall -k --user 0 com.tencent.qqmusicwatch && %adb% shell pm uninstall -k --user 0 com.sogou.map.android.maps && %adb% shell pm uninstall -k --user 0 com.umetrip.android.msky.app && %adb% shell pm uninstall -k --user 0 com.gotokeep.keep && %adb% shell pm uninstall -k --user 0 com.tigerbrokers.stock
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

:CONNECT
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
echo. Downloading Latest Google Fit
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Google/GoogleFit.apk -P ./data/apps
echo. Installing Latest Google Fit
%adb% install -r data/apps/GoogleFit.apk
echo. Latest Google Fit Installed
echo. Downloading Latest Google Maps
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Google/GoogleMaps.apk -P ./data/apps
echo. Installing Latest Google Maps
%adb% install -r data/apps/GoogleMaps.apk
echo. Latest Google Maps Installed
echo. Downloading Latest Google Quick Search
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Google/GoogleQuickSearch.apk -P ./data/apps
echo. Installing Latest Google Quick Search
%adb% install -r data/apps/GoogleQuickSearch.apk
echo. Latest Google Quick Search Installed
echo. Downloading Latest GoogleTTS
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Google/GoogleTTS.apk -P ./data/apps
echo. Installing Latest GoogleTTS
%adb% install -r data/apps/GoogleTTS.apk
echo. Latest GoogleTTS Installed
echo. Downloading Latest Google Translate
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Google/GoogleTranslate.apk -P ./data/apps
echo. Installing Latest Google Translate
%adb% install -r data/apps/GoogleTranslate.apk
echo. Latest Google Translate Installed
echo. Downloading Latest Google Wear Keyboard
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Google/WearKeyboard.apk -P ./data/apps
echo. Installing Latest Google Wear Keyboard
%adb% install -r data/apps/WearKeyboard.apk
echo. Latest Google Wear Keyboard Installed
echo. Downloading Latest Google Calculator
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Google/GoogleCalc.apk -P ./data/apps
echo. Installing Latest Google Calculator
%adb% install -r data/apps/GoogleCalc.apk
echo. Latest Google Calculator Installed
echo. Downloading Latest Google Clock
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Google/GoogleClock.apk -P ./data/apps
echo. Installing Latest Google Clock
%adb% install -r data/apps/GoogleClock.apk
echo. Latest Google Clock Installed
echo. Downloading Latest Google Services
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Google/GoogleServices.apk -P ./data/apps
echo. Installing Latest Google Services
%adb% install -r data/apps/GoogleServices.apk
echo. Latest Google Services Installed
Timeout /t 5 >data/null
%ch% 4F
del /S data\apps\*.apk
echo. ******** All Google Apps Installed *****
Timeout /t 2 >data/null
echo.-----------------------------------------------------------------------------------
%ch% 47
Timeout /t 1 >data/null
echo.
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
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Others/Pujie.apk -P ./data/apps
echo. Installing Latest Pujie Black
%adb% install -r data/apps/Pujie.apk
echo. Latest Pujie Black Installed
echo. Downloading Latest AccuWeather
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Others/AccuWeather.apk -P ./data/apps
echo. Installing Latest AccuWeather
%adb% install -r data/apps/AccuWeather.apk
echo. Latest AccuWeather Installed
echo. Downloading Latest Ultimate Alexa
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Others/UltimateAlexa.apk -P ./data/apps
echo. Installing Latest Ultimate Alexa
%adb% install -r data/apps/UltimateAlexa.apk
echo. Latest Ultimate Alexa Installed
Timeout /t 5 >data/null
%ch% 4F
del /S data\apps\*.apk
echo. ******** Other Apps All Installed *****
Timeout /t 2 >data/null
echo.-----------------------------------------------------------------------------------
%ch% 47
Timeout /t 1 >data/null
echo.
echo. && echo.
echo. && echo.
echo                    Press any key to back to MAIN MEMU
%ch% 44
pause
%ch% 00
GOTO START

:MORELOCALE
cls
color 47
echo. Downloading Latest MoreLocale
data\wget.exe -q http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Others/MoreLocale.apk -P ./data/apps
echo. Installing Latest MoreLocale
%adb% install -r data/apps/MoreLocale.apk
echo. Latest MoreLocale Installed
echo. Running MoreLocale Config
%adb% shell pm grant jp.co.c_lis.ccl.morelocale android.permission.CHANGE_CONFIGURATION
Timeout /t 5 >data/null
%ch% 4F
del /S data\apps\*.apk
echo. ******** MoreLocale Installed & Enabled *****
Timeout /t 2 >data/null
echo.-----------------------------------------------------------------------------------
%ch% 47
Timeout /t 1 >data/null
echo.
echo. && echo.
echo. && echo.
echo                    Press any key to back to MAIN MEMU
%ch% 44
pause
%ch% 00
GOTO START