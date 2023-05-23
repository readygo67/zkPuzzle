pragma circom 2.1.4;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/gates.circom";


template Swap(nBits){
    signal input in[2];
    signal output out[2];

    signal gt <== GreaterThan(nBits)([in[0], in[1]]);
    out[0] <== (in[1] - in[0])*gt + in[0];
    out[1] <== (in[0] - in[1])*gt + in[1];
}

template BubbleSort(n, nBits){
    signal input in[n];
    signal output out[n];
    signal tmp[n][n][n]; //[round][step][element]

    component swap[n-1][n-1];

    tmp[0][0][0] <== in[0];
    tmp[0][0][1] <== in[1];

    for (var j=2;j<n;j++){
        tmp[0][j-1][j] <== in[j]; 
    }

    // (i-1)round, the ith round has (n-i-1) step.
    for (var i=0; i<n-1;i++){
        for (var j=0;j < n -i -1;j++){   
            swap[i][j] = Swap(nBits);
            swap[i][j].in[0] <== tmp[i][j][j];
            swap[i][j].in[1] <== tmp[i][j][j+1];

            tmp[i][j+1][j] <== swap[i][j].out[0];
            tmp[i][j+1][j+1] <== swap[i][j].out[1];
        }
        
        //prepare data for the next round 
        tmp[i+1][0][0] <== tmp[i][1][0];
        for (var k=1;k< n-i-1;k++){
            tmp[i+1][k-1][k] <== tmp[i][k+1][k]; 
        }
    }
    
    //pickup output
    out[0] <== tmp[n-2][1][0];
    out[1] <== tmp[n-2][1][1];

    for (var i=2;i<=n-1;i++){
        out[i] <== tmp[n-1-i][i][i];
    }
}

template NotEqual(){
    signal input in[2];
    signal output out;

    signal isequal <== IsEqual()([in[0], in[1]]);
    out <== 1 - isequal;
    0 === out *(1- out);
}

//所有的元素互不相同，且[bound[0], bound[1]]的范围内
template DifferentiaInRange(n,nBits){
    signal input in[n];
    signal input bound[2]; //bound[0] 下限，bound[1] 上限
    signal output out;
    signal sorted[n];

    //排序
    component sort = BubbleSort(n,nBits);
    for (var i=0; i<n; i++){
        sort.in[i] <== in[i];
    }

    for (var i=0; i<n; i++){
        sorted[i] <== sort.out[i];
    }

    //检查排序后相邻结果互不相同,
    component ands = MultiAND(n+1); 
    for (var i=0; i<n-1;i++){
        ands.in[i] <== NotEqual()([in[i], in[i+1]]);
    }

    //使用MultiAND检查在下限和上限范围内
    ands.in[n-1] <== GreaterEqThan(nBits)([sorted[0], bound[0]]);
    ands.in[n] <== LessEqThan(nBits)([sorted[n-1], bound[1]]);

    out <== ands.out;
}

template Puzzle(n, nBits) {
    signal input in[n];
    signal input bound[2];
	  signal output out;

    // 检查所有的输入两两不相同并在上限和下限范围内
    component diffs = DifferentiaInRange(n, nBits);
    for (var i=0;i<n;i++){
        diffs.in[i] <== in[i];
    }
    diffs.bound[0] <== bound[0];
    diffs.bound[1] <== bound[1];
    1 === diffs.out;

    //约束满足题目条件
    13 === in[0] + in[1];
    13 === in[1] + in[2] + in[3];
    13 === in[3] + in[4] + in[5];
    13 === in[5] + in[6] + in[7];
    13 === in[7] + in[8];
}

component main  = Puzzle(9,8);

/* INPUT = {
    "in": ["4", "9", "1", "3", "8", "2", "5", "6", "7"],
    "bound":["1","9"]
} */