from .piece import Piece
from differentfiles.colors import *
from differentfiles.utils import *
from differentfiles.drawing import (
    draw_line_round_corners_polygon,
    see_through,
    see_through2,
)


class Bishop(Piece):
    def __init__(self, x, y, c):
        super().__init__(x, y, c)
        self.set_letter("♗")

    def draw_moves(self, pieces):
        fake_piece = Bishop(self.start_x, self.start_y, self.color)
        directions = [[10, 10], [-10, -10], [10, -10], [-10, 10]]
        end_positions = []
        for d in directions:
            fake_piece.slide(d[0], d[1], [p for p in pieces if p != self], fake=True)
            end_positions.append((fake_piece.x, fake_piece.y))
            fake_piece.slide(0, 0, [p for p in pieces if p != self], fake=True)

        for end_pos in end_positions:
            draw_line_round_corners_polygon(
                see_through2,
                to_screen_coords((self.start_x, self.start_y)),
                to_screen_coords(end_pos),
                GREEN_HIGHLIGHT,
                self.radius * 2 * 640 / 8,
            )

    def drag(self, new_p, pieces):
        if self.grabbed:
            self.slide(0, 0, pieces)
            path, dist = self.select_path(
                (self.start_x, self.start_y), [[1, 1], [-1, 1]], new_p
            )
            path_len = math.sqrt(path[0] ** 2 + path[1] ** 2)
            self.slide(path[0] * dist / path_len, path[1] * dist / path_len, pieces)

    def draw_paths(self, pieces):
        if self.targeted:
            return

        if self.deleted:
            return

        fake_piece = Bishop(self.start_x, self.start_y, self.color)

        directions = [[10, 10], [-10, -10], [10, -10], [-10, 10]]
        end_positions = []
        for d in directions:
            fake_piece.slide(d[0], d[1], [p for p in pieces if p != self], fake=True)
            end_positions.append((fake_piece.x, fake_piece.y))
            fake_piece.slide(0, 0, [p for p in pieces if p != self], fake=True)

        for end_pos in end_positions:
            draw_line_round_corners_polygon(
                see_through,
                to_screen_coords((self.start_x, self.start_y)),
                to_screen_coords(end_pos),
                RED_HIGHLIGHT,
                self.radius * 2 * 640 / 8,
            )
