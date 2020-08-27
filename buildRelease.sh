echo What is build number && \
read buildNum && \
pkg package.json && \
mv miwatchkleaner2-* ./release && \
mv ./release/miwatchkleaner2-win-* ./release/Windows && \
mv ./release/miwatchkleaner2-linux-* ./release/Linux && \
mv ./release/miwatchkleaner2-macos-* ./release/MacOs && \
cp ./data/xiaomiPackageRemovalList.json ./release/Windows/data/ && \
cp ./data/xiaomiPackageRemovalList.json ./release/MacOS/data/ && \
cp ./data/xiaomiPackageRemovalList.json ./release/Linux/data/ && \
chmod 0777 ./release/**/adb && \
chmod 0777 ./release/**/miwatchkleaner2-* && \
chmod +x ./release/**/adb && \
chmod +x ./release/**/miwatchkleaner2-* && \
cd release/MacOS/ && \
tar -pcvzf miwatchkleaner.$buildNum-macos.tar.gz adb data/ miwatchkleaner2-macos-x64 && \
cd .. && \
cd Linux/ && \
tar -pcvzf miwatchkleaner.$buildNum-Linux.tar.gz adb data/ miwatchkleaner2-linux-x64 && \
cd .. && \
cd Windows/ && \
zip -r miwatchkleaner.$buildNum-win.zip adb.exe AdbWinApi.dll AdbWinUsbApi.dll data/ miwatchkleaner2-win-x86.exe