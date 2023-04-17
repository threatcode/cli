curl -Lo ./threatcode-cli.exe 'https://static.threatcode.github.io/cli/latest/threatcode-win.exe'
./threatcode-cli.exe --version
chmod -R +x ./threatcode-cli
mv ./threatcode-cli.exe "/bin/threatcode.exe"
threatcode --version
