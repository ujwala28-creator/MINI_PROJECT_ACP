#include <stdio.h>
#include <math.h>
#include <string.h>

#define ROWS 30
#define COLS 60

char canvas[ROWS][COLS];

void initializeCanvas()
{
    for(int i = 0; i < ROWS; i++)
    {
        for(int j = 0; j < COLS; j++)
        {
            canvas[i][j] = '_';
        }
    }
}

void displayCanvas()
{
    for(int i = 0; i < ROWS; i++)
    {
        for(int j = 0; j < COLS; j++)
        {
            printf("%c", canvas[i][j]);
        }
        printf("\n");
    }
}

void drawPoint(int x, int y)
{
    if(x >= 0 && x < ROWS && y >= 0 && y < COLS)
    {
        canvas[x][y] = '*';
    }
}

void deletePoint(int x, int y)
{
    if(x >= 0 && x < ROWS && y >= 0 && y < COLS)
    {
        canvas[x][y] = '_';
    }
}

void drawLine(int x1, int y1, int x2, int y2)
{
    int dx = abs(x2 - x1);
    int dy = abs(y2 - y1);

    int steps = (dx > dy) ? dx : dy;

    float xInc = (float)(x2 - x1) / steps;
    float yInc = (float)(y2 - y1) / steps;

    float x = x1;
    float y = y1;

    for(int i = 0; i <= steps; i++)
    {
        drawPoint(round(x), round(y));
        x += xInc;
        y += yInc;
    }
}

void drawRectangle(int x, int y, int width, int height)
{
    drawLine(x, y, x, y + width);
    drawLine(x, y, x + height, y);
    drawLine(x + height, y, x + height, y + width);
    drawLine(x, y + width, x + height, y + width);
}

void drawTriangle(int x1, int y1, int x2, int y2, int x3, int y3)
{
    drawLine(x1, y1, x2, y2);
    drawLine(x2, y2, x3, y3);
    drawLine(x3, y3, x1, y1);
}

void drawCircle(int xc, int yc, int r)
{
    for(int angle = 0; angle < 360; angle++)
    {
        float rad = angle * 3.14159 / 180;

        int x = xc + r * cos(rad);
        int y = yc + r * sin(rad);

        drawPoint(x, y);
    }
}

void modifyPoint(int oldX, int oldY, int newX, int newY)
{
    deletePoint(oldX, oldY);
    drawPoint(newX, newY);
}

int main()
{
    int choice;

    initializeCanvas();

    while(1)
    {
        printf("\n===== 2D GRAPHICS EDITOR =====\n");
        printf("1. Draw Line\n");
        printf("2. Draw Rectangle\n");
        printf("3. Draw Triangle\n");
        printf("4. Draw Circle\n");
        printf("5. Delete Point\n");
        printf("6. Modify Point\n");
        printf("7. Display Picture\n");
        printf("8. Clear Canvas\n");
        printf("9. Exit\n");

        printf("Enter choice: ");
        scanf("%d", &choice);

        if(choice == 1)
        {
            int x1, y1, x2, y2;

            printf("Enter x1 y1 x2 y2: ");
            scanf("%d%d%d%d", &x1, &y1, &x2, &y2);

            drawLine(x1, y1, x2, y2);
        }

        else if(choice == 2)
        {
            int x, y, width, height;

            printf("Enter x y width height: ");
            scanf("%d%d%d%d", &x, &y, &width, &height);

            drawRectangle(x, y, width, height);
        }

        else if(choice == 3)
        {
            int x1, y1, x2, y2, x3, y3;

            printf("Enter triangle points: ");
            scanf("%d%d%d%d%d%d",
                  &x1, &y1,
                  &x2, &y2,
                  &x3, &y3);

            drawTriangle(x1, y1, x2, y2, x3, y3);
        }

        else if(choice == 4)
        {
            int xc, yc, r;

            printf("Enter center x y and radius: ");
            scanf("%d%d%d", &xc, &yc, &r);

            drawCircle(xc, yc, r);
        }

        else if(choice == 5)
        {
            int x, y;

            printf("Enter point to delete: ");
            scanf("%d%d", &x, &y);

            deletePoint(x, y);
        }

        else if(choice == 6)
        {
            int oldX, oldY, newX, newY;

            printf("Enter old point: ");
            scanf("%d%d", &oldX, &oldY);

            printf("Enter new point: ");
            scanf("%d%d", &newX, &newY);

            modifyPoint(oldX, oldY, newX, newY);
        }

        else if(choice == 7)
        {
            displayCanvas();
        }

        else if(choice == 8)
        {
            initializeCanvas();
            printf("Canvas Cleared!\n");
        }

        else if(choice == 9)
        {
            break;
        }

        else
        {
            printf("Invalid Choice!\n");
        }
    }

    return 0;
}
