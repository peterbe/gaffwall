#!/usr/bin/env python
import logging
import shutil
import os
from PIL import Image

LOG_FILENAME = 'tiler.log'
logging.basicConfig(filename=LOG_FILENAME,
                    level=logging.DEBUG)
                                        

def generate_tiles(base_image, size, zoom, point=None, save_directory=None):
    assert zoom >= 1
    img = Image.open(base_image)
    
    if not os.path.isdir(str(size)):
        os.mkdir(str(size))
        
    if save_directory is None:
        save_directory = os.path.dirname(base_image)

    if not os.path.isdir(os.path.join(save_directory, '256/%s' % zoom)):
        os.mkdir(os.path.join(save_directory, '256/%s' % zoom))
        
    width = size * 2 ** zoom
    
    if zoom >= 6 and not point:
        raise IOError("Too slow. Doing all of this will be too slow")

    img = img.resize((width, width), True)
    if point:
        x, y = point
        assert x in range(2 ** zoom) and y in range(2 ** zoom)
        
        yield _crop_and_save(save_directory, img, size, zoom, x, y)
    else:
        for i in range(2** zoom):
            for j in range(2 ** zoom):
                #yield (i*size, j*size), (size+i*size, size+j*size)
                yield _crop_and_save(save_directory, img, size, zoom, i, j)
                
def _crop_and_save(save_directory, img, size, zoom, x, y):
    region = img.crop((x*size, y*size, size+x*size, size+y*size))
    filename = os.path.join(save_directory,
                            '%s/%s/%s,%s.png' % (size, zoom, x, y))
    region.save(filename, img.format)
    return filename
    

def run(*args):
    args = list(args)
    if '--stdout' in args:
        stdout = True
        args.remove('--stdout')
    else:
        stdout = False
        
    base_directory = args[0]
    if not os.path.isdir(base_directory):
        raise OSError("No directory called %s" % base_directory)
    
    zoom = int(args[1])
    try:
        (x, y) = [int(e) for e in args[2:]]
        point = (x, y)
    except ValueError:
        point = None
    
    logging.info("zoom=%r, point=%r" %(zoom, point))
    base_image = os.path.join(base_directory, 'worldmap.png')
    for filename in generate_tiles(base_image, 256, zoom, point):
        logging.info("Created: %s" % str(filename))
        if stdout:
            print open(filename, 'rb').read()
        else:
            print filename
            
    return 0

if __name__ == '__main__':
    import sys
    sys.exit(run(*sys.argv[1:]))