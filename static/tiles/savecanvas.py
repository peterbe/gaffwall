#!/usr/bin/env python
from PIL import Image
from cStringIO import StringIO
import os
import base64
import sys

def run(data, zoom, x, y):
    here = os.path.dirname(__file__)
    full = os.path.join(here, "worldmap-copy.png")
    img = Image.open(full)
    
    decoded_data = StringIO(base64.b64decode(data))
    decoded_img = Image.open(decoded_data)
    
    #doodle = Image.fromstring(
    decoded_size = decoded_img.size
    img.paste(decoded_img, (0, 0, decoded_size[0], decoded_size[1]))
    img.save(os.path.join(here, 'worldmap-copy-pasted.png'))
    #open(full, "w").write(decoded)

    return 0

if __name__ == '__main__':
    import sys
    sys.exit(run(*sys.argv[1:]))