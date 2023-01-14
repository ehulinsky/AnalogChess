import math
import pygame
from differentfiles.utils import width, height, dist, to_game_coords
from differentfiles.drawing import draw_center_text, draw_circle, screen


class Piece:
    # x pos and y pos are on a grid of size 8, normal cartesian coordinates
    def __init__(self, x_pos, y_pos, color):
        diameter = 0.7
        self.x = x_pos
        self.y = y_pos
        self.radius = diameter / 2
        self.grabbed = False
        self.targeted = False
        self.color = color

        self.start_x = self.x
        self.start_y = self.y
        text_scale = 0.85
        self.letter = "X"
        self.font = pygame.font.SysFont(
            "segoeuisymbol", int(diameter / 8 * 640 * text_scale)
        )
        self.text = self.font.render(self.letter, True, (255, 255, 255))
        self.direction = False
        self.targeted = False
        self.turn = 0
        self.deleted = False

    def set_letter(self, letter):
        self.letter = letter
        if not self.grabbed:
            self.text = self.font.render(
                self.letter,
                True,
                (255 - self.color[0], 255 - self.color[1], 255 - self.color[2]),
            )
        else:
            self.text = self.font.render(self.letter, True, (0, 255, 0))

    def can_promote(self):
        return False

    def draw_paths(self, pieces):
        pass

    def target(self):
        self.targeted = True
        self.text = self.font.render(self.letter, True, (255, 0, 0))

    def untarget(self):
        self.targeted = False
        self.set_letter(self.letter)

    def draw(self):
        x = int(self.x / 8 * width)
        y = height - int(self.y / 8 * height)
        # draw_circle(screen,x,y,int(self.radius/8*width),(255-self.color[0],255-self.color[1],255-self.color[2]))
        draw_circle(screen, x, y, int(self.radius / 8 * width), self.color)
        screen.blit(
            self.text,
            (x - self.text.get_width() // 2, y - 2 - self.text.get_height() // 2),
        )

    def try_grab(self, pos):
        if dist(pos, (self.x, self.y)) < self.radius:
            self.grabbed = True
            self.text = self.font.render(self.letter, True, (0, 255, 0))

    def cancel(self, pieces):
        if self.grabbed:
            self.grabbed = False
            for piece in pieces:
                if piece.targeted:
                    piece.untarget()
            self.direction = False
            self.text = self.font.render(
                self.letter,
                True,
                (255 - self.color[0], 255 - self.color[1], 255 - self.color[2]),
            )
            self.x = self.start_x
            self.y = self.start_y

    def confirm(self, pieces):

        if self.grabbed:
            self.grabbed = False
            for piece in pieces:
                if piece.targeted:
                    piece.deleted = True
                    piece.x = 100
                    piece.start_x = 100
            self.direction = False
            self.text = self.font.render(
                self.letter,
                True,
                (255 - self.color[0], 255 - self.color[1], 255 - self.color[2]),
            )

            self.start_x = self.x
            self.start_y = self.y
            self.turn += 1

    def ungrab(self, pieces):
        if self.grabbed:

            if (
                abs(self.x - self.start_x) < 1 / 1000
                and abs(self.y - self.start_y) < 1 / 1000
            ):
                self.cancel(pieces)
                return

            font = pygame.font.SysFont("oldenglishtext", int(80))
            confirm_text = font.render("Confirm?", True, (0, 0, 0))
            draw_center_text(confirm_text)

            pygame.display.flip()
            # while not done:
            while True:
                for event in pygame.event.get():
                    if event.type == pygame.QUIT:
                        pygame.quit()
                        quit()
                    if event.type == pygame.MOUSEBUTTONUP:
                        if (
                            dist(
                                to_game_coords(pygame.mouse.get_pos()), (self.x, self.y)
                            )
                            < self.radius
                        ):
                            self.confirm(pieces)
                            return
                        else:
                            self.cancel(pieces)
                            return

                    elif event.type == pygame.KEYDOWN:
                        if event.key == pygame.K_RETURN:
                            self.confirm(pieces)
                            return
                        elif event.key == pygame.K_ESCAPE:
                            self.cancel(pieces)
                            return

    def overlaps(self, piece):
        return dist((self.x, self.y), (piece.x, piece.y)) < self.radius * 2

    # math shit
    def slide(self, dx, dy, pieces, capture=True, fake=False):

        all_pieces = pieces
        if capture:
            pieces = [
                p
                for p in pieces
                if (p.x - self.start_x) * dx + (p.y - self.start_y) * dy > 0
                and p != self
                and p.color == self.color
            ]
        if fake:
            pieces = [
                p
                for p in pieces
                if (p.x - self.start_x) * dx + (p.y - self.start_y) * dy > 0
                and p != self
                and p.color == self.color
                and p.targeted == False
            ]
        else:
            pieces = [
                p
                for p in pieces
                if (p.x - self.start_x) * dx + (p.y - self.start_y) * dy > 0
                and p != self
            ]

        angle = math.atan2(dy, dx)

        # resolve wall collisions
        # dont do this if the piece is off the board it wont work right
        if 0 <= self.start_x <= 8 and 0 <= self.start_y <= 8:
            if abs(dx) > 0:
                if self.start_x + dx + self.radius > 8:
                    ratio = dy / dx
                    dx = (8 - self.start_x) - self.radius
                    dy = ratio * ((8 - self.start_x) - self.radius)

                if self.start_x + dx - self.radius < 0:
                    ratio = dy / dx
                    dx = -self.start_x + self.radius
                    dy = ratio * (-self.start_x + self.radius)

            if abs(dy) > 0:
                if self.start_y + dy + self.radius > 8:
                    ratio = dx / dy
                    dy = (8 - self.start_y) - self.radius
                    dx = ratio * ((8 - self.start_y) - self.radius)
                if self.start_y + dy - self.radius < 0:
                    ratio = dx / dy
                    dy = -self.start_y + self.radius
                    dx = ratio * (-self.start_y + self.radius)

        first_block = False
        block_dist = 99999999
        block_perp_dist = 999999999

        full_dist = math.sqrt(dx**2 + dy**2)
        new_dist = full_dist
        # find first piece that intersects with the line of travel. Move it back behind this piece.
        for piece in pieces:
            # formula for distance from point to line
            h = abs(
                math.cos(angle) * (self.y - piece.y)
                - math.sin(angle) * (self.x - piece.x)
            )

            if h < piece.radius * 2:
                proj_dist = math.sqrt(
                    dist((self.start_x, self.start_y), (piece.x, piece.y)) ** 2 - h**2
                )
                if proj_dist < block_dist:
                    block_dist = proj_dist
                    block_perp_dist = h
                    first_block = piece

        hit_first_block = False
        if first_block:
            distance = dist(
                (first_block.x, first_block.y), (self.start_x + dx, self.start_y + dy)
            )
            if math.sqrt(dx**2 + dy**2) > block_dist:
                hit_first_block = True
                new_dist = block_dist - math.sqrt(
                    4 * self.radius**2 - block_perp_dist**2
                )

        if abs(full_dist) > 0:
            self.x = self.start_x + dx * new_dist / full_dist
            self.y = self.start_y + dy * new_dist / full_dist

        new_new_dist = new_dist
        first_hit_piece = False
        # Still could be colliding with pieces, check collisions with all other pieces and move it behind minimum distance collision
        for piece in pieces:
            if self.overlaps(piece):
                block_perp_dist = abs(
                    math.cos(angle) * (self.y - piece.y)
                    - math.sin(angle) * (self.x - piece.x)
                )
                block_dist = math.sqrt(
                    dist((self.start_x, self.start_y), (piece.x, piece.y)) ** 2
                    - block_perp_dist**2
                )
                new_new_dist = block_dist - math.sqrt(
                    4 * self.radius**2 - block_perp_dist**2
                )
                if new_new_dist < new_dist:
                    new_dist = new_new_dist
                    first_hit_piece = piece

        if abs(full_dist) > 0:
            self.x = self.start_x + dx * new_dist / full_dist
            self.y = self.start_y + dy * new_dist / full_dist
        else:
            self.x = self.start_x
            self.y = self.start_y

        if capture:
            self.slide_attack(
                (self.x - self.start_x), self.y - self.start_y, all_pieces, fake=fake
            )

    def slide_attack(self, dx, dy, pieces, fake=False):

        angle = math.atan2(dy, dx)
        all_pieces = pieces
        pieces = [
            p
            for p in pieces
            if (p.x - self.start_x) * dx + (p.y - self.start_y) * dy > 0
            and p != self
            and p.color != self.color
        ]

        first_piece_hit = False
        first_hit_dist = 99999999
        perp_dist = 999999999

        full_dist = math.sqrt(dx**2 + dy**2)
        new_dist = full_dist

        # find piece that will be hit first
        for piece in pieces:
            # formula for distance from point to line
            h = abs(
                math.cos(angle) * (self.y - piece.y)
                - math.sin(angle) * (self.x - piece.x)
            )

            if h < piece.radius * 2:
                d = dist((piece.x, piece.y), (self.start_x, self.start_y))
                hit_dist = math.sqrt(d**2 - h**2) - math.sqrt(
                    4 * piece.radius**2 - h**2
                )
                if hit_dist < first_hit_dist:
                    first_hit_dist = hit_dist
                    perp_dist = h
                    first_piece_hit = piece

        if not fake:
            for piece in all_pieces:
                piece.untarget()

        if first_piece_hit:
            if self.overlaps(first_piece_hit):
                if not fake:
                    first_piece_hit.target()
            elif dist(
                (self.x, self.y), (self.start_x, self.start_y)
            ) > first_hit_dist + 2 * math.sqrt(4 * piece.radius**2 - perp_dist**2):
                new_dist = first_hit_dist + 2 * math.sqrt(
                    4 * piece.radius**2 - perp_dist**2
                )
                if not fake:
                    first_piece_hit.target()

        if abs(full_dist) > 0:
            self.x = self.start_x + dx * new_dist / full_dist
            self.y = self.start_y + dy * new_dist / full_dist

        # Still could be colliding with pieces, check collisions with all other pieces and target them
        if not fake:
            for piece in pieces:
                if self.overlaps(piece):
                    piece.target()

    def select_path(self, start, paths, point):
        min_h = 9999999
        min_path = None
        for path in paths:
            h = abs(
                (path[0]) * (start[1] - point[1]) - (start[0] - point[0]) * path[1]
            ) / math.sqrt((path[0]) ** 2 + path[1] ** 2)
            if h < min_h:
                min_h = h
                min_path = path
                dot_prod = path[0] * (point[0] - start[0]) + path[1] * (
                    point[1] - start[1]
                )
                if dot_prod == 0:
                    min_l = 0
                else:
                    min_l = (
                        math.sqrt(dist(point, start) ** 2 - h**2)
                        * dot_prod
                        / abs(dot_prod)
                    )

        return (min_path, min_l)

    def draw_moves(self, pieces):
        pass
