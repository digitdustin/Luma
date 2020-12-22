import time
import sys
import pyscreenshot as ImageGrab
import binascii
import struct
from PIL import Image
import numpy as np
import scipy
import scipy.misc
import scipy.cluster
from colour import Color

NUM_CLUSTERS = 1

label = sys.argv[1]
left = sys.argv[2]
right = sys.argv[3]
top = sys.argv[4]
bottom = sys.argv[5]



i = 0
while (True):
    # capture part of the screen
    im = ImageGrab.grab(bbox=(int(left), int(top), int(right), int(bottom)), backend="mss", childprocess=False)  # X1,Y1,X2,Y2
    im = im.resize((150, 150))      # optional, to reduce time
    ar = np.asarray(im)
    shape = ar.shape
    ar = ar.reshape(np.product(shape[:2]), shape[2]).astype(float)

    # print('finding clusters')
    codes, dist = scipy.cluster.vq.kmeans(ar, NUM_CLUSTERS)
    # print('cluster centres:\n', codes)

    vecs, dist = scipy.cluster.vq.vq(ar, codes)         # assign codes
    counts, bins = np.histogram(vecs, len(codes))    # count occurrences

    index_max = np.argmax(counts)                    # find most frequent
    peak = codes[index_max]
    colour = binascii.hexlify(bytearray(int(c) for c in peak)).decode('ascii')
    # print('most frequent is %s (#%s)' % (peak, colour))
    # convert from hex to hsl
    print(colour)

    # print(str(i) + 'frames calculated')
    sys.stdout.flush()
    time.sleep(.1)
    i += 1
 

