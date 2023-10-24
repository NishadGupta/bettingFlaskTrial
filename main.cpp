//
//  main.cpp
//  mustafaGame
//
//  Created by Kulekci, Oguzhan on 8/31/23.
//

#include <iostream>

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define MAX_N 8
#define PRINTGAME 1
#define PRINTWINNINGSTREAM 1

int randomInteger(int min, int max) {
    return min + rand() % (max - min + 1);
}

void shuffle(int arr[], int size) {
    for (int i = size - 1; i > 0; i--) {
        int j = rand() % (i + 1);
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}


void Tournament(int N, int B) {
    
    unsigned int one = 1;
    unsigned int numPlayer = (one<<N)+2;
    
    unsigned int* playerID = new unsigned int[numPlayer];
    unsigned int* budget   = new unsigned int[numPlayer];
    unsigned int* bet      = new unsigned int[numPlayer];
    
    int betRecord[N+1][numPlayer]; // data[rndID][playerID] is the bet offered by player at round rndID
    for(int i=0;i<N+1;i++)
        for(int j=0;j<numPlayer;j++) betRecord[i][j]=-1;

   
    // Initialize players and budgets
    for (int i = 1; i <= numPlayer; i++) {
        playerID[i-1] = i-1;
        budget[i-1] = B;
    }
    
    if (PRINTGAME) {printf("Each line represents a round with (playerID,betAmount)\n");}

    for (int round = 1; round <= N + 1; round++) {
        
        int playerCount = one << (N - round + 1);
        if (round == 1) playerCount += 2;
        if (round == N + 1) playerCount++;
        
        // Randomly shuffle active players
        shuffle((int*)playerID, playerCount);
        
        // Players determine their bets (currently randomly assigned by the machine)
        for (int i = 0; i < playerCount; i++) {
            if (round==N+1)
                bet[i] = budget[playerID[i]];
            else bet[i] = randomInteger(0, budget[playerID[i]]);
                
            budget[playerID[i]] -= bet[i];
        }
        
        // record the bets
        for (int i = 0; i < playerCount; i++){
            betRecord[round-1][playerID[i]]=bet[i];
            if (PRINTGAME) std::cout << "(" << playerID[i] << ',' << bet[i] << ")" << '\t' ;
        }
        if (PRINTGAME)  std::cout << std::endl;
        
        
        // Move winners to the first playerCount/2 positions
        for (int i = 0; i < playerCount / 2; i++) {
            int winner;
            if (bet[2 * i] < bet[2 * i + 1]) winner = 2 * i + 1;
            else if (bet[2 * i] > bet[2 * i + 1]) winner = 2 * i;
            else {// ıf they have offered same bet amount, the one with a higher budget will be promoted
                if (budget[playerID[2 * i]] < budget[playerID[2 * i + 1]]) winner = 2 * i +1;
                else if (budget[playerID[2 * i]] > budget[playerID[2 * i + 1]]) winner = 2 * i ;
                else winner = randomInteger(2 * i, 2 * i + 1);//ıf their budget are equal, select winner randomly
            }
            playerID[i] = playerID[winner];
            bet[i] = bet[winner];
        }
        
        // Determine the best of best and move it to position playerCount/2
             if (round < N) {
                 int j = playerCount / 2;
                 int k = j;
                 
                 // Sort playerID and bet pairs by increasing bet values
                 for (int i = 0; i < k - 1; i++) {
                     for (int m = 0; m < k - 1 - i; m++) {
                         if (bet[m] > bet[m + 1]) {
                             int tempID = playerID[m];
                             int tempBet = bet[m];
                             playerID[m] = playerID[m + 1];
                             bet[m] = bet[m + 1];
                             playerID[m + 1] = tempID;
                             bet[m + 1] = tempBet;
                         }
                     }
                 }
                 
                 // Find the last index k such that bet[k] != bet[k - 1]
                 while (k > 1 && bet[k - 1] == bet[k - 2]) {
                     k--;
                 }
                 
                 // Sort playerID[k-1,j-1] and corresponding bet pairs by increasing budget values
                 int p = (j-1) - (k-1) + 1;
                             
                 for (int i = 0 ; i < p - 1 ; i++) {
                     for (int m = k-1; m < j - 1 - i; m++) {
                         if (budget[playerID[m]] > budget[playerID[m + 1]]) {
                             int tempID = playerID[m];
                             int tempBet = bet[m];
                             playerID[m] = playerID[m + 1];
                             bet[m] = bet[m + 1];
                             playerID[m + 1] = tempID;
                             bet[m + 1] = tempBet;
                         }
                     }
                 }
                 
                 // Find the last index m such that budget[playerID[m]] != budget[playerID[m - 1]]
                 int m = k;
                 while (m > 1 && budget[playerID[m - 1]] == budget[playerID[m - 2]]) {
                     m--;
                 }
                 
                 // Randomly select pass between [m..j] which offered the maximum bet and have their budgets equally highest
                 int pass = randomInteger(m - 1, j - 1);
                 
                 // Swap playerID[j] and playerID[pass], and bet[j] and bet[pass]
                 int tempID = playerID[j - 1];
                 int tempBet = bet[j - 1];
                 playerID[j - 1] = playerID[pass];
                 bet[j - 1] = bet[pass];
                 playerID[pass] = tempID;
                 bet[pass] = tempBet;
             }
             
             // Move previous pass winner to next round
             if (round > 1 && round <= N) {
                 playerID[playerCount/2 ] = playerID[playerCount/2 -1 ];
                 playerID[playerCount/2 - 1] = playerID[ playerCount ];
             }
         }
        
        int award=0;
        for(int i=0;i<numPlayer;i++) award += (B-budget[i]);
    
         // Print tournament data
        if (PRINTGAME) printf("Winner ID: %d\n", playerID[0]);
        if (PRINTGAME) printf("Award: %d\n", award);
        if (PRINTWINNINGSTREAM){
            for(int i=0;i<N+1;i++){
                printf("%d\t", betRecord[i][playerID[0]]);
            }
            if (PRINTWINNINGSTREAM) printf("%d\n", award);
        }
   // printf("\n");
     }


int main(int argc, const char * argv[]) {
    
    int N = 3; // Number of rounds = N + 1
    int B = 100; // Initial budget for each player
    int repeat = 5;
    
    long* seed = new long[repeat];
    srand(time(NULL)); // Seed the random number generator
    for(int i=0;i<repeat;i++) seed[i] =rand();

    
    
    for(int i=0;i<repeat;i++){
        srand(seed[i]); // Seed the random number generator
        Tournament(N, B);
    }
    
    return 0;
}
