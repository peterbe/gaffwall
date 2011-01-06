#!/usr/bin/env python
from PIL import Image
from cStringIO import StringIO
import os
import base64
import sys

def run(data, zoom, x, y):
    here = os.path.dirname(__file__)
    full = os.path.join(here, "worldmap.png")
    img = Image.open(full)
    img = img.convert('RGBA')
    
    decoded_data = StringIO(base64.b64decode(data))
    decoded_img = Image.open(decoded_data)
    
    #doodle = Image.fromstring(
    decoded_size = decoded_img.size
    blank_img = Image.new('RGBA', img.size, (0,0,0,0))
    blank_img.paste(decoded_img, (200, 200))
    #blank_img.save('foo.png', format='PNG')
    img = Image.composite(blank_img, img, blank_img)
    img.save(os.path.join(here, 'worldmap-copy-pasted.png'))
    
    #open(full, "w").write(decoded)

    return 0

def test_paste():
    data = open('data.dat').read()
    
    run(data, None, None, None)
    
    
if __name__ == '__main__':
    import sys
    sys.exit(run(*sys.argv[1:]))
    
    