"""FastAPI server for real-time coordinate data."""

import math
import time

from fastapi import FastAPI

app = FastAPI()


@app.get('/')
def get_coordinate():
    x = time.time()
    return {'x': x, 'y': math.sin(x)}
