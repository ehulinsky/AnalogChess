from .piece import Piece
from differentfiles.colors import *
from differentfiles.utils import *
from differentfiles.drawing import draw_line_round_corners_polygon, see_through, see_through2


class Pawn(Piece):
    def __init__(self, x, y, d):
        super().__init__(x, y, d)
        self.set_letter("♙")

    def draw_moves(self, pieces):

        fake_piece = Pawn(self.start_x, self.start_y, self.color)

        end_positions = []
        forward_dist = 1
        if self.turn == 0:
            forward_dist = 2

        if self.color == white:
            directions = [[1, 1], [-1, 1]]
            fake_piece.slide(
                0, forward_dist, [p for p in pieces if p != self], capture=False
            )
            end_positions.append((fake_piece.x, fake_piece.y))
            fake_piece.slide(0, 0, [p for p in pieces if p != self], capture=False)
        else:
            directions = [[-1, -1], [1, -1]]
            fake_piece.slide(
                0, -forward_dist, [p for p in pieces if p != self], capture=False
            )
            end_positions.append((fake_piece.x, fake_piece.y))
            fake_piece.slide(0, 0, [p for p in pieces if p != self], capture=False)

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
            if self.color == white:
                path, dist = self.select_path(
                    (self.start_x, self.start_y), [[1, 1], [-1, 1], [0, 1]], new_p
                )
                path_len = math.sqrt(path[0] ** 2 + path[1] ** 2)
                self.direction = path
                if self.direction == [1, 1]:
                    self.slide(
                        clamp(path[0] * dist / path_len, 0, 1),
                        clamp(path[1] * dist / path_len, 0, 1),
                        pieces,
                    )
                elif self.direction == [-1, 1]:
                    self.slide(
                        clamp(path[0] * dist / path_len, -1, 0),
                        clamp(path[1] * dist / path_len, 0, 1),
                        pieces,
                    )
                else:
                    max_move = 1
                    if self.turn == 0:
                        max_move = 2
                    self.slide(
                        0,
                        clamp(path[1] * dist / path_len, 0, max_move),
                        pieces,
                        capture=False,
                    )
            else:
                path, dist = self.select_path(
                    (self.start_x, self.start_y), [[1, -1], [-1, -1], [0, -1]], new_p
                )
                path_len = math.sqrt(path[0] ** 2 + path[1] ** 2)
                self.direction = path
                if self.direction == [1, -1]:
                    self.slide(
                        clamp(path[0] * dist / path_len, 0, 1),
                        clamp(path[1] * dist / path_len, -1, 0),
                        pieces,
                    )
                elif self.direction == [-1, -1]:
                    self.slide(
                        clamp(path[0] * dist / path_len, -1, 0),
                        clamp(path[1] * dist / path_len, -1, 0),
                        pieces,
                    )
                else:
                    max_move = 1
                    if self.turn == 0:
                        max_move = 2
                    self.slide(
                        0,
                        clamp(path[1] * dist / path_len, -max_move, 0),
                        pieces,
                        capture=False,
                    )

    def can_promote(self):
        if self.color == white:
            if self.y - self.radius > 7:
                return True
        if self.color == black:
            if self.y + self.radius < 1:
                return True

    def ungrab(self, pieces):
        if self.grabbed:
            attacked = False
            for piece in pieces:
                if piece.targeted:
                    attacked = True

            if self.direction:
                if not attacked and (self.direction[0] != 0):
                    self.cancel(pieces)
                    self.cancel(pieces)
                    return

            super().ungrab(pieces)

    def draw_paths(self, pieces):

        if self.deleted:
            return

        if self.targeted:
            return
        fake_piece = Pawn(self.start_x, self.start_y, self.color)

        if self.color == white:
            directions = [[1, 1], [-1, 1]]
        else:
            directions = [[-1, -1], [1, -1]]

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
