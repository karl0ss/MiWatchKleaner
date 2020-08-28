echo What is build number && \
read buildNum && \
pkg package.json && \
mv miwatchkleaner-* ./release && \
mv ./release/miwatchkleaner-win-* ./release/Windows && \
mv ./release/miwatchkleaner-linux-* ./release/Linux && \
mv ./release/miwatchkleaner-macos-* ./release/MacOs && \
cp ./data/xiaomiPackageRemovalList.json ./release/Windows/data/ && \
cp ./data/xiaomiPackageRemovalList.json ./release/MacOS/data/ && \
cp ./data/xiaomiPackageRemovalList.json ./release/Linux/data/ && \
chmod 0777 ./release/**/adb && \
chmod 0777 ./release/**/miwatchkleaner-* && \
chmod +x ./release/**/adb && \
chmod +x ./release/**/miwatchkleaner-* && \
cd release/MacOS/ && \
tar -pcvzf miwatchkleaner.$buildNum-macos.tar.gz adb data/ my_apk/ miwatchkleaner-macos-x64 && \
cd .. && \
cd Linux/ && \
tar -pcvzf miwatchkleaner.$buildNum-Linux.tar.gz adb data/ my_apk/ miwatchkleaner-linux-x64 && \
cd .. && \
cd Windows/ && \
zip -r miwatchkleaner.$buildNum-win.zip adb.exe AdbWinApi.dll AdbWinUsbApi.dll data/ my_apk/ miwatchkleaner-win-x86.exe