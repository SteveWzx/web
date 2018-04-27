# 数据结构与算法

### 时间复杂度，空间复杂度

### 遍历二叉树

### 简单的算法：打印 100 以内的所有质数

------

```java
public static void main(String[] args){
    System.out.println(2);
    System.out.println(3);
    System.out.println(5);
    System.out.println(7);
    for(int i = 10; i <= 100; i++){
        if(i%2 != 0 && i%3 != 0 && i%5 != 0 && i%7 != 0){
            System.out.println(i);
        }
    } 
}
```

### 10 万个整数中找出排序后的前 10 个数（Top N 问题，或重复的数），及其对应算法复杂度

------

1. 快速排序：O（nlogn）
2. 局部淘汰法：用一个容器存放 10 个数，遍历对比放入，最后容器里面的就是所求的数。O（n+m^2）
3. 分治法：分成例如：100份，找到每份最大的 10 个数，然后对 100 份比较。
4. Hash 去重
5. 最小堆：O（nmlogm）

### 堆排序的实现，算法复杂度

------

### 冒泡排序

------

```java
public static void bubbleSort(int [] arr){
    int j , k;
    int flag = arr.length ;//flag来记录最后交换的位置，也就是排序的尾边界

    while (flag > 0){//排序未结束标志
        k = flag; //k 来记录遍历的尾边界
        flag = 0;

        for(j = 1; j < k; j++){
            if(arr[j - 1] > arr[j]){//前面的数字大于后面的数字就交换
                //交换a[j-1]和a[j]
                int temp;
                temp = arr[j - 1];
                arr[j - 1] = arr[j];
                arr[j]=temp;

                //表示交换过数据;
                flag = j;//记录最新的尾边界.
            }
        }
    }
}
```

### 快速排序

### 快速排序和冒泡的排序，怎么转换一下