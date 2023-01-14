import math
import pygame
from pygame import gfxdraw

from differentfiles.utils import width, height, size
from differentfiles.colors import *


screen = pygame.display.set_mode(size)

see_through = pygame.Surface((width, height)).convert_alpha()
see_through2 = pygame.Surface((width, height)).convert_alpha()
see_through.fill((0, 0, 0, 0))


def draw_checkers():
    for i in range(8):
        for j in range(8):
            size = width // 8
            color = dark_gray
            if (i + j) % 2 == 0:
                color = light_gray
            pygame.draw.rect(screen, color, (i * size, j * size, size, size))


def draw_circle(surface, x, y, radius, color):
    gfxdraw.aacircle(surface, x, y, radius, color)
    gfxdraw.filled_circle(surface, x, y, radius, color)


def pygame_draw_circle(surface, color, screen_coords, radius, **kwargs):
    pygame.draw.circle(surface, color, screen_coords, radius, **kwargs)


def draw_circle_outline(surface, x, y, radius, color):
    gfxdraw.aacircle(surface, x, y, radius, color)
    gfxdraw.circle(
        surface, x, y, radius, (255 - color[0], 255 - color[1], 255 - color[2])
    )


def draw_center_text(text):
    screen.blit(
        text,
        (
            width // 2 - text.get_width() // 2,
            height // 2 - text.get_height() // 2,
        ),
    )


def draw_line_round_corners_polygon(surf, p1, p2, c, w):
    if p1 != p2:
        p1v = pygame.math.Vector2(p1)
        p2v = pygame.math.Vector2(p2)
        lv = (p2v - p1v).normalize()
        lnv = pygame.math.Vector2(-lv.y, lv.x) * w // 2
        pts = [p1v + lnv, p2v + lnv, p2v - lnv, p1v - lnv]
        pygame.draw.polygon(surf, c, pts)
        pygame.draw.circle(surf, c, p1, round(w / 2))
        pygame.draw.circle(surf, c, p2, round(w / 2))
    else:
        pygame.draw.circle(surf, c, p1, round(w / 2))


def getpolygon(origin, radius, N, start=0, end=None):
    out = []
    x, y = origin
    Nf = float(N)
    if end is None:
        end = math.pi * 2
    for i in range(N):
        xp = x + radius * math.sin(end * i / Nf + start)
        yp = y - radius * math.cos(end * i / Nf + start)
        out.append((xp, yp))
    return out


def arc(surf, color, origin, radius, start=0, end=None, width=0, N=64):
    if width == 0 or width >= radius * 0.5:
        p2 = [origin]
    else:
        p2 = getpolygon(origin, radius - width, N, start=start, end=end)
        p2.reverse()
    p1 = getpolygon(origin, radius, N, start=start, end=end)
    p1.extend(p2)
    r = pygame.draw.polygon(surf, color, p1)
    return r
