#!/bin/bash

# FILL THESE WITH YOUR OWN SDKs PATHS and APP-ETHEREUM's ROOT
NANOS_SDK=$NANOS_SDK
NANOX_SDK=$NANOX_SDK
NANOSP_SDK=$NANOSP_SDK
APP_ETHEREUM=/plugin_dev/app-ethereum

# create elfs folder if it doesn't exist
mkdir -p elfs

# move to repo's root to build apps
cd ..

echo "*Building elfs for Nano S..."
export BOLOS_SDK="$NANOS_SDK"

echo "**Building app-openocean for Nano S..."
make clean
make -j DEBUG=1
cp bin/app.elf "tests/elfs/openocean_nanos.elf"

echo "**Building app-ethereum for Nano S..."
cd $APP_ETHEREUM
make clean BOLOS_SDK=$NANOS_SDK
make -j DEBUG=1 BOLOS_SDK=$NANOS_SDK CHAIN=ethereum BYPASS_SIGNATURES=1 ALLOW_DATA=1
cd -
cp "${APP_ETHEREUM}/bin/app.elf" "tests/elfs/ethereum_nanos.elf"


echo "*Building elfs for Nano X..."
export BOLOS_SDK="$NANOX_SDK"

echo "**Building app-openocean for Nano X..."
make clean
make -j DEBUG=1
cp bin/app.elf "tests/elfs/openocean_nanox.elf"

echo "**Building app-ethereum for Nano X..."
cd $APP_ETHEREUM
make clean BOLOS_SDK=$NANOX_SDK
make -j DEBUG=1 BOLOS_SDK=$NANOX_SDK CHAIN=ethereum BYPASS_SIGNATURES=1 ALLOW_DATA=1
cd -
cp "${APP_ETHEREUM}/bin/app.elf" "tests/elfs/ethereum_nanox.elf"


echo "*Building elfs for Nano X..."
export BOLOS_SDK="$NANOSP_SDK"

echo "**Building app-openocean for Nano S+..."
make clean
make -j DEBUG=1
cp bin/app.elf "tests/elfs/openocean_nanosp.elf"

echo "**Building app-ethereum for Nano S+..."
cd $APP_ETHEREUM
make clean BOLOS_SDK=$NANOSP_SDK
make -j DEBUG=1 BOLOS_SDK=$NANOSP_SDK CHAIN=ethereum BYPASS_SIGNATURES=1 ALLOW_DATA=1
cd -
cp "${APP_ETHEREUM}/bin/app.elf" "tests/elfs/ethereum_nanosp.elf"

echo "done"
