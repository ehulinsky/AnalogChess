import math

width, height = 640, 640
size = (width, height)


def dist(p1, p2):
    return math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)


def to_game_coords(p):
    return (p[0] / width * 8, 8 - p[1] / height * 8)


def to_screen_coords(p):
    return (p[0] / 8 * width, height - p[1] / 8 * width)


def clamp(n, smallest, largest):
    return max(smallest, min(n, largest))
