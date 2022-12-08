import pygame
import math
from pygame import gfxdraw


def draw_circle(surface, x, y, radius, color):
    gfxdraw.aacircle(surface, x, y, radius, color)
    gfxdraw.filled_circle(surface, x, y, radius, color)

pygame.init()

size = width, height = 640, 640
black = (0, 0, 0)
white= (255,255,255)
light_gray = (255,222,173)
dark_gray = (222,184,135)

screen = pygame.display.set_mode(size)


def dist(p1,p2):
    return math.sqrt((p1[0]-p2[0])**2+(p1[1]-p2[1])**2)

def to_game_coords(p):
    return (p[0]/width*8,8-p[1]/height*8)

def clamp(n, smallest, largest):
    return max(smallest, min(n, largest))

class Piece():
    #x pos and y pos are on a grid of size 8, normal cartesian coordinates
    def __init__(self, x_pos, y_pos, color):
        diameter = 0.7
        self.x = x_pos
        self.y = y_pos
        self.radius = diameter/2
        self.grabbed = False
        self.targeted = False
        if color=="white":
            self.color = white
        else:
            self.color = black
            
        self.start_x=self.x
        self.start_y=self.y
        text_scale = 0.8
        self.letter = 'X'
        self.font = pygame.font.SysFont("oldenglishtext", int(diameter/8*640*text_scale))
        self.text = self.font.render(self.letter, True, (255,255,255))
        self.direction = False
        self.targeted = False
        self.turn = 0

    def set_letter(self,letter):
        self.letter = letter
        if not self.grabbed:
            self.text = self.font.render(self.letter, True, (255-self.color[0],255-self.color[1],255-self.color[2]))
        else:
            self.text = self.font.render(self.letter, True, (0,255,0))

    def target(self):
        self.targeted=True
        self.text = self.font.render(self.letter, True, (255,0,0))

    def untarget(self):
        self.targeted=False
        self.set_letter(self.letter)
        
    def draw(self):
        x = int(self.x/8*width)
        y = height-int(self.y/8*height)
        draw_circle(screen,x,y,int(self.radius/8*width),self.color)
        screen.blit(self.text, (x - self.text.get_width() // 2, y - self.text.get_height() // 2))

    def try_grab(self,pos):
        if dist(pos,(self.x,self.y)) < self.radius:
            self.grabbed = True
            self.text = self.font.render(self.letter, True, (0,255,0))


    def cancel(self,pieces):
        if self.grabbed:
            self.grabbed=False
            for piece in pieces:
                if piece.targeted:
                    piece.untarget()
            self.direction = False
            self.text = self.font.render(self.letter, True, (255-self.color[0],255-self.color[1],255-self.color[2]))
            self.x = self.start_x
            self.y = self.start_y

    def confirm(self,pieces):
        if self.grabbed:
            self.grabbed=False
            for piece in pieces:
                if piece.targeted:
                    piece.x=100
            self.direction = False
            self.text = self.font.render(self.letter, True, (255-self.color[0],255-self.color[1],255-self.color[2]))
            
            self.start_x = self.x
            self.start_y = self.y
            self.turn += 1
        
    def ungrab(self,pieces):
        if self.grabbed:

            if abs(self.x-self.start_x)< 1/1000 and abs(self.y-self.start_y)<1/1000:
                self.cancel(pieces)
                return
                
            font = pygame.font.SysFont("oldenglishtext", int(80))
            confirm_text = font.render("Confirm?", True, (0,0,0))
            screen.blit(confirm_text, (width//2 - confirm_text.get_width() // 2, height//2 - confirm_text.get_height() // 2))

            pygame.display.flip()
            while not done:
                for event in pygame.event.get():
                    if event.type == pygame.QUIT:
                        pygame.quit()
                        quit()
                    elif event.type == pygame.KEYDOWN:
                        if event.key == pygame.K_RETURN:
                            self.confirm(pieces)
                            return
                        elif event.key == pygame.K_ESCAPE:
                            self.cancel(pieces)
                            return
                        
            



    def overlaps(self,piece):
        return dist((self.x,self.y),(piece.x,piece.y))<self.radius*2
    
    #math shit
    def slide(self,dx,dy,pieces,capture=True):

        all_pieces = pieces
        if capture:
            pieces = [p for p in pieces if (p.x-self.start_x)*dx+(p.y-self.start_y)*dy>0 and p!=self and p.color==self.color]
        else:
            pieces = [p for p in pieces if (p.x-self.start_x)*dx+(p.y-self.start_y)*dy>0 and p!=self]
            
        angle=math.atan2(dy,dx)


        #resolve wall collisions

        if abs(dx)>0:
            if self.start_x+dx+self.radius>8:
                ratio=dy/dx
                dx=(8-self.start_x)-self.radius
                dy= ratio * ((8-self.start_x)-self.radius)

            if self.start_x+dx-self.radius<0:
                ratio=dy/dx
                dx=-self.start_x+self.radius
                dy= ratio * (-self.start_x+self.radius)

        if abs(dy)>0:
            if self.start_y+dy+self.radius>8:
                ratio=dx/dy
                dy=(8-self.start_y)-self.radius
                dx= ratio * ((8-self.start_y)-self.radius)
            if self.start_y+dy-self.radius<0:
                ratio=dx/dy
                dy=-self.start_y+self.radius
                dx= ratio * (-self.start_y+self.radius)

        
        first_block=False
        block_dist = 99999999
        block_perp_dist = 999999999

        full_dist = math.sqrt(dx**2+dy**2)
        new_dist=full_dist
        #find first piece that intersects with the line of travel. Move it back behind this piece.
        for piece in pieces:
            #formula for distance from point to line
            h=abs(math.cos(angle)*(self.y-piece.y)-math.sin(angle)*(self.x-piece.x))
            
            if h<piece.radius*2:
                proj_dist=math.sqrt(dist((self.start_x,self.start_y),(piece.x,piece.y))**2 - h**2)
                if proj_dist<block_dist:
                    block_dist=proj_dist
                    block_perp_dist = h
                    first_block = piece
        
        hit_first_block=False
        if first_block:
            distance= dist((first_block.x,first_block.y),(self.start_x+dx,self.start_y+dy))
            if math.sqrt(dx**2+dy**2) > block_dist:
                hit_first_block=True
                new_dist = block_dist - math.sqrt(4*self.radius**2-block_perp_dist**2)

        
        if abs(full_dist)>0:
            self.x = self.start_x+dx*new_dist/full_dist
            self.y = self.start_y+dy*new_dist/full_dist
        

        new_new_dist = new_dist
        first_hit_piece=False
        #Still could be colliding with pieces, check collisions with all other pieces and move it behind minimum distance collision
        for piece in pieces:
            if self.overlaps(piece):
                block_perp_dist=abs(math.cos(angle)*(self.y-piece.y)-math.sin(angle)*(self.x-piece.x))
                block_dist=math.sqrt(dist((self.start_x,self.start_y),(piece.x,piece.y))**2 - block_perp_dist**2)
                new_new_dist = block_dist - math.sqrt(4*self.radius**2-block_perp_dist**2)
                if new_new_dist < new_dist:
                    new_dist = new_new_dist
                    first_hit_piece = piece

        if abs(full_dist)>0:
            self.x = self.start_x+dx*new_dist/full_dist
            self.y = self.start_y+dy*new_dist/full_dist
        else:
            self.x = self.start_x
            self.y = self.start_y

        if capture:
            self.slide_attack((self.x-self.start_x),self.y-self.start_y,all_pieces)


    def slide_attack(self,dx,dy,pieces):

        angle=math.atan2(dy,dx)
        pieces = [p for p in pieces if (p.x-self.start_x)*dx+(p.y-self.start_y)*dy>0 and p!=self and p.color!=self.color]

        first_piece_hit=False
        first_hit_dist = 99999999
        perp_dist = 999999999

        full_dist = math.sqrt(dx**2+dy**2)
        new_dist=full_dist

        #find piece that will be hit first
        for piece in pieces:
            #formula for distance from point to line
            h=abs(math.cos(angle)*(self.y-piece.y)-math.sin(angle)*(self.x-piece.x))
            
            if h<piece.radius*2:
                d=dist((piece.x,piece.y),(self.start_x,self.start_y))
                hit_dist=math.sqrt(d**2-h**2)-math.sqrt(4*piece.radius**2-h**2)
                if hit_dist<first_hit_dist:
                    first_hit_dist=hit_dist
                    perp_dist = h
                    first_piece_hit = piece


        for piece in pieces:
            piece.untarget()
            
        if first_piece_hit:
            if self.overlaps(first_piece_hit):
                first_piece_hit.target()
            elif dist((self.x,self.y),(self.start_x,self.start_y))>first_hit_dist+2*math.sqrt(4*piece.radius**2-perp_dist**2):
                new_dist = first_hit_dist+2*math.sqrt(4*piece.radius**2-perp_dist**2)
                first_piece_hit.target()

        if abs(full_dist)>0:
            self.x = self.start_x+dx*new_dist/full_dist
            self.y = self.start_y+dy*new_dist/full_dist


        #Still could be colliding with pieces, check collisions with all other pieces and target them
        for piece in pieces:
            if self.overlaps(piece):
                piece.target()
        
        

class Pawn(Piece):
    def __init__(self, x, y, d):
        super().__init__(x,y,d)
        self.set_letter("P")
        self.first_turn=True
        
    def drag(self,new_p,pieces):
        if self.grabbed:
            x=new_p[0]-self.start_x
            y=new_p[1]-self.start_y
            if self.direction == False:
                if math.sqrt(x**2+y**2)>15/640*8:
                    angle=math.atan2(y,x)
                    if angle<0:
                        angle = math.pi+angle
                        
                    if angle>math.pi/8:
                        self.direction = 'du'
                    if angle>3*math.pi/8:
                        self.direction = 'v'
                    if 5*math.pi/8<angle<7*math.pi/8:
                        self.direction = 'dd'

            
            if self.direction == 'v':
                if self.color==white:
                    max_move=1
                    if self.turn==0:
                        max_move=2
                    self.slide(0,clamp(new_p[1]-self.start_y,0,max_move),pieces,capture=False)
                elif self.color==black:
                    max_move=1
                    if self.turn==0:
                        max_move=2
                    self.slide(0,clamp(new_p[1]-self.start_y,-max_move,0),pieces,capture=False)
            
            if self.direction == 'du':
                if self.color==white:
                    self.slide(clamp((x+y)/(2),0,1),clamp((x+y)/(2),0,1),pieces)
                else:
                    self.slide(clamp((x+y)/(2),-1,0),clamp((x+y)/(2),-1,0),pieces)
                    
            elif self.direction == 'dd':
                if self.color==white:
                    self.slide(clamp((x-y)/(2),-1,0),clamp((-x+y)/(2),0,1),pieces)
                else:
                    self.slide(clamp((x-y)/(2),0,1),clamp((-x+y)/(2),-1,0),pieces)
            
                
    def ungrab(self,pieces):
        if self.grabbed:
            attacked=False
            for piece in pieces:
                if piece.targeted:
                    attacked=True
            
            if not attacked and (self.direction=='dd' or self.direction=='du'):
                self.cancel(pieces)
                self.cancel(pieces)
                return
            
            super().ungrab(pieces)

        
        


class Rook(Piece):
    def __init__(self, x, y, d):
        super().__init__(x,y,d)
        self.set_letter("R")
        
    def drag(self,new_p,pieces):
        if self.grabbed:
            if self.direction == False:
                if abs(new_p[0]-self.start_x)>15/640*8:
                    self.direction="h"
                elif abs(new_p[1]-self.start_y)>15/640*8:
                    self.direction="v"

            
            if self.direction == 'v':
                self.slide(0,new_p[1]-self.start_y,pieces)

            if self.direction == 'h':
                self.slide(new_p[0]-self.start_x,0,pieces)



class Knight(Piece):
    def __init__(self, x, y, d):
        super().__init__(x,y,d)
        self.set_letter("N")
        self.last_x=self.x
        self.last_y=self.y

    def drag(self,new_p,pieces):
        if self.grabbed:
            
            x=new_p[0]-self.start_x
            y=new_p[1]-self.start_y
            if math.sqrt(x**2+y**2)>40/640*8:
                distance = math.sqrt(x**2+y**2)
                
                radius = math.sqrt(5)
                
                self.x = self.start_x + radius*x/distance
                self.y = self.start_y + radius*y/distance

            for piece in pieces:
                piece.untarget()
                if self.overlaps(piece) and piece!=self and piece.color ==self.color or self.x+self.radius>8 or self.x-self.radius<0 or self.y+self.radius>8 or self.y-self.radius<0:
                    self.x = self.last_x
                    self.y = self.last_y

                if self.overlaps(piece) and piece.color !=self.color:
                    piece.target()

                    
            self.last_x=self.x
            self.last_y=self.y

    
class Bishop(Piece):
    
    def __init__(self, x, y, c):
        super().__init__(x,y,c)
        self.set_letter("B")
        
    def drag(self,new_p,pieces):
        if self.grabbed:
            x=new_p[0]-self.start_x
                
            y=new_p[1]-self.start_y
            if self.direction == False:
                
                if abs(x)+abs(y)>15*math.sqrt(2)/640*8:
                    if x*y>0:
                        self.direction='du'
                    else:
                        self.direction = 'dd'
            
            if self.direction == 'du':
                self.slide((x+y)/(2),(x+y)/(2),pieces)

            elif self.direction == 'dd':
                self.slide((x-y)/(2),(-x+y)/(2),pieces)


class Queen(Piece):
    def __init__(self, x, y, c):
        super().__init__(x,y,c)
        self.set_letter("Q")
        
    def drag(self,new_p,pieces):
        if self.grabbed:
            x=new_p[0]-self.start_x
                
            y=new_p[1]-self.start_y
            if self.direction == False:

                #LMAOOOOOOOO
                if math.sqrt(x**2+y**2)>20/640*8:
                    angle=math.atan2(y,x)
                    if angle<0:
                        angle = 2*math.pi+angle
                    if angle<math.pi/8:
                        self.direction = 'h'
                    elif angle<3*math.pi/8:
                        self.direction='du'
                    elif angle<5*math.pi/8:
                        self.direction='v'
                    elif angle<7*math.pi/8:
                        self.direction='dd'
                    elif angle<9*math.pi/8:
                        self.direction = 'h'
                    elif angle<11*math.pi/8:
                        self.direction='du'
                    elif angle<13*math.pi/8:
                        self.direction='v'
                    elif angle<15*math.pi/8:
                        self.direction='dd'
                    else:
                        self.direction = 'h'
                    
                        
            
            if self.direction == 'v':
                self.slide(0,new_p[1]-self.start_y,pieces)

            if self.direction == 'h':
                self.slide(new_p[0]-self.start_x,0,pieces)

            if self.direction == 'du':
                self.slide((x+y)/(2),(x+y)/(2),pieces)

            elif self.direction == 'dd':
                self.slide((x-y)/(2),(-x+y)/(2),pieces)




class King(Piece):
    def __init__(self, x, y, c):
        super().__init__(x,y,c)
        self.set_letter("K")
        
    def drag(self,new_p,pieces):
        if self.grabbed:
            x=new_p[0]-self.start_x
                
            y=new_p[1]-self.start_y
            if self.direction == False:

                #LMAOOOOOOOO
                if math.sqrt(x**2+y**2)>20/640*8:
                    angle=math.atan2(y,x)
                    if angle<0:
                        angle = 2*math.pi+angle
                    if angle<math.pi/8:
                        self.direction = 'h'
                    elif angle<3*math.pi/8:
                        self.direction='du'
                    elif angle<5*math.pi/8:
                        self.direction='v'
                    elif angle<7*math.pi/8:
                        self.direction='dd'
                    elif angle<9*math.pi/8:
                        self.direction = 'h'
                    elif angle<11*math.pi/8:
                        self.direction='du'
                    elif angle<13*math.pi/8:
                        self.direction='v'
                    elif angle<15*math.pi/8:
                        self.direction='dd'
                    else:
                        self.direction = 'h'
                    
                        
            
            if self.direction == 'v':
                self.slide(0,clamp(new_p[1]-self.start_y,-1,1),pieces)

            if self.direction == 'h':
                self.slide(clamp(new_p[0]-self.start_x,-1,1),0,pieces)

            if self.direction == 'du':
                self.slide(clamp((x+y)/2, -1,1   ),clamp((x+y)/2, -1,1   ),pieces)

            elif self.direction == 'dd':
                self.slide(clamp((x-y)/2,  -1,1  ),clamp((-x+y)/2, -1,1    ),pieces)



                
def draw_checkers():
    for i in range(8):
        for j in range(8):
            size = width//8
            color = dark_gray
            if((i+j)%2==0):
                color=light_gray
            pygame.draw.rect(screen,color,(i*size,j*size,size,size))
            



radius=0.7
pieces = [Rook(0.5,0.5,'white'),
          Rook(7.5,0.5,'white'),
          Knight(1.5,0.5,'white'),
          Knight(6.5,0.5,'white'),
          Bishop(5.5,0.5,'white'),
          Bishop(2.5,0.5,'white'),
          King(4.5,0.5,'white'),
          Queen(3.5,0.5,'white'),
          Pawn(0.5,1.5,'white'),
          Pawn(1.5,1.5,'white'),
          Pawn(2.5,1.5,'white'),
          Pawn(3.5,1.5,'white'),
          Pawn(4.5,1.5,'white'),
          Pawn(5.5,1.5,'white'),
          Pawn(6.5,1.5,'white'),
          Pawn(7.5,1.5,'white'),


          Rook(0.5,7.5,'black'),
          Rook(7.5,7.5,'black'),
          Knight(1.5,7.5,'black'),
          Knight(6.5,7.5,'black'),
          Bishop(5.5,7.5,'black'),
          Bishop(2.5,7.5,'black'),
          King(4.5,7.5,'black'),
          Queen(3.5,7.5,'black'),
          Pawn(0.5,6.5,'black'),
          Pawn(1.5,6.5,'black'),
          Pawn(2.5,6.5,'black'),
          Pawn(3.5,6.5,'black'),
          Pawn(4.5,6.5,'black'),
          Pawn(5.5,6.5,'black'),
          Pawn(6.5,6.5,'black'),
          Pawn(7.5,6.5,'black'),
          ]


done = False
clock = pygame.time.Clock()
confirmed = True


while not done:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            quit()
        elif event.type == pygame.MOUSEBUTTONDOWN:
            for piece in pieces:
                piece.try_grab(to_game_coords(pygame.mouse.get_pos()))
        elif event.type == pygame.MOUSEMOTION:
            for piece in pieces:
                piece.drag(to_game_coords(pygame.mouse.get_pos()),pieces)
        elif event.type == pygame.MOUSEBUTTONUP:
            for piece in pieces:
                piece.ungrab(pieces)

    '''
    if not pygame.mouse.get_focused():
        for piece in pieces:
            piece.ungrab(pieces)
    '''
    draw_checkers()

    for piece in pieces:
        piece.draw()
    pygame.display.flip()
    clock.tick(60)

