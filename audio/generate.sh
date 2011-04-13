#!/bin/bash

if [ \! -d generated ]; then
    mkdir generated
fi

echo "Generating directional sounds..."

for i in originals/*.wav; do
    basename=`basename -s .wav $i`
    echo "- $basename"

    sox $i generated/$basename-0.wav remix - - pad
    sox $i generated/$basename-1.wav remix - 0 pad
    sox $i generated/$basename-2.wav remix - - pad
    sox $i generated/$basename-3.wav remix 0 - pad
done

echo
echo "Generating MP3 and Ogg Vorbis files..."

for i in generated/*.wav; do
    basename=`basename -s .wav $i`
    echo "- $basename"

    ffmpeg -y -i $i generated/$basename.mp3 &> /dev/null
    ffmpeg -y -i $i generated/$basename.ogg &> /dev/null
done
