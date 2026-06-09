#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define ROWS 20
#define COLS 40

// Global 2D array canvas
char canvas[ROWS][COLS];

// Function Prototypes
void initializeCanvas();
void displayCanvas();
void drawLine(int x1, int y1, int x2, int y2, char brush);
void drawRectangle(int x, int y, int width, int height, char brush);
void drawCircle(int cx, int cy, int radius, char brush);
void drawTriangle(int x1, int y1, int x2, int y2, int x3, int y3, char brush);
void plot(int x, int y, char brush);

int main() {
    int choice, subChoice;
    initializeCanvas();

    while (1) {
        printf("\n--- 2D GRAPHICS EDITOR ---\n");
        printf("1. Display Canvas\n");
        printf("2. Add an Object (Draw)\n");
        printf("3. Delete an Object (Erase area)\n");
        printf("4. Reset Canvas\n");
        printf("5. Exit\n");
        printf("Enter your choice: ");

        if (scanf("%d", &choice) != 1) {
            // Clear invalid input
            while (getchar() != '\n');
            printf("Invalid input! Please enter a number.\n");
            continue;
        }

        if (choice == 5) {
            printf("Exiting editor. Goodbye!\n");
            break;
        }

        switch (choice) {
            case 1:
                displayCanvas();
                break;

            case 2: // Add Objects
            case 3: // Delete Objects
                {
                    char brush = (choice == 2) ? '*' : '_';
                    printf("\nSelect Shape:\n1. Line\n2. Rectangle\n3. Circle\n4. Triangle\nChoice: ");
                    if (scanf("%d", &subChoice) != 1) {
                        while (getchar() != '\n');
                        printf("Invalid input!\n");
                        continue;
                    }

                    if (subChoice == 1) {
                        int x1, y1, x2, y2;
                        printf("Enter Start (Row Col) and End (Row Col): ");
                        scanf("%d %d %d %d", &y1, &x1, &y2, &x2);
                        drawLine(x1, y1, x2, y2, brush);
                    } 
                    else if (subChoice == 2) {
                        int x, y, w, h;
                        printf("Enter Top-Left corner (Row Col), Width, Height: ");
                        scanf("%d %d %d %d", &y, &x, &w, &h);
                        drawRectangle(x, y, w, h, brush);
                    } 
                    else if (subChoice == 3) {
                        int cx, cy, r;
                        printf("Enter Center (Row Col) and Radius: ");
                        scanf("%d %d %d", &cy, &cx, &r);
                        drawCircle(cx, cy, r, brush);
                    } 
                    else if (subChoice == 4) {
                        int x1, y1, x2, y2, x3, y3;
                        printf("Enter 3 Vertices (Row1 Col1, Row2 Col2, Row3 Col3): ");
                        scanf("%d %d %d %d %d %d", &y1, &x1, &y2, &x2, &y3, &x3);
                        drawTriangle(x1, y1, x2, y2, x3, y3, brush);
                    } else {
                        printf("Invalid shape choice!\n");
                    }
                    displayCanvas();
                    break;
                }

            case 4:
                initializeCanvas();
                printf("Canvas cleared!\n");
                displayCanvas();
                break;

            default:
                printf("Invalid choice! Try again.\n");
        }
    }
    return 0;
}

// Fills the background with underscores
void initializeCanvas() {
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            canvas[i][j] = '_';
        }
    }
}

// Prints the 2D grid matrix to console
void displayCanvas() {
    printf("\n");
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            printf("%c", canvas[i][j]);
        }
        printf("\n");
    }
}

// Helper to safely plot a point within matrix bounds
void plot(int x, int y, char brush) {
    if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
        canvas[y][x] = brush;
    }
}

// Bresenham's Line Generation Algorithm
void drawLine(int x1, int y1, int x2, int y2, char brush) {
    int dx = abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
    int dy = -abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
    int err = dx + dy, e2;

    while (1) {
        plot(x1, y1, brush);
        if (x1 == x2 && y1 == y2) break;
        e2 = 2 * err;
        if (e2 >= dy) { err += dy; x1 += sx; }
        if (e2 <= dx) { err += dx; y1 += sy; }
    }
}

// Draws a rectangle outline
void drawRectangle(int x, int y, int width, int height, char brush) {
    drawLine(x, y, x + width - 1, y, brush);                  // Top
    drawLine(x, y + height - 1, x + width - 1, y + height - 1, brush); // Bottom
    drawLine(x, y, x, y + height - 1, brush);                  // Left
    drawLine(x + width - 1, y, x + width - 1, y + height - 1, brush); // Right
}

// Midpoint Circle Drawing Algorithm
void drawCircle(int cx, int cy, int radius, char brush) {
    int x = 0;
    int y = radius;
    int d = 3 - 2 * radius;

    while (y >= x) {
        plot(cx + x, cy + y, brush);
        plot(cx - x, cy + y, brush);
        plot(cx + x, cy - y, brush);
        plot(cx - x, cy - y, brush);
        plot(cx + y, cy + x, brush);
        plot(cx - y, cy + x, brush);
        plot(cx + y, cy - x, brush);
        plot(cx - y, cy - x, brush);
        
        x++;
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
    }
}

// Draws a triangle outline by connecting three distinct vertices
void drawTriangle(int x1, int y1, int x2, int y2, int x3, int y3, char brush) {
    drawLine(x1, y1, x2, y2, brush);
    drawLine(x2, y2, x3, y3, brush);
    drawLine(x3, y3, x1, y1, brush);
}
