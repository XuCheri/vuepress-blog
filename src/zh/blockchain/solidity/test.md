# 引用类型, array, struct

这一讲，我们将介绍`solidity`中的两个重要变量类型：数组（`array`）和结构体（`struct`）。

## 数组 array
数组（`Array`）是`solidity`常用的一种变量类型，用来存储一组数据（整数，字节，地址等等）。数组分为固定长度数组和可变长度数组两种：

- 固定长度数组：在声明时指定数组的长度。用`T[k]`的格式声明，其中`T`是元素的类型，`k`是长度，例如：
```solidity
    // 固定长度 Array
    uint[8] array1;
    bytes1[5] array2;
    address[100] array3;
```
- 可变长度数组（动态数组）：在声明时不指定数组的长度。用`T[]`的格式声明，其中`T`是元素的类型，例如：
```solidity
    // 可变长度 Array
    uint[] array4;
    bytes1[] array5;
    address[] array6;
    bytes array7;
```
**注意**：`bytes`比较特殊，是数组，但是不用加`[]`。另外，不能用`byte[]`声明单字节数组，可以使用`bytes`或`bytes1[]`。在gas上，`bytes`比`bytes1[]`便宜。因为`bytes1[]`在`memory`中要增加31个字节进行填充，会产生额外的gas。但是在`storage`中，由于内存紧密打包，不存在字节填充。

### 创建数组的规则
在solidity里，创建数组有一些规则：

- 对于`memory`修饰的`动态数组`，可以用`new`操作符来创建，但是必须声明长度，并且声明后长度不能改变。例子：
```solidity
    // memory动态数组
    uint[] memory array8 = new uint[](5);
    bytes memory array9 = new bytes(9);
```
- 数组字面常数(Array Literals)是写作表达式形式的数组，用方括号包着来初始化array的一种方式，并且里面每一个元素的type是以第一个元素为准的，例如`[1,2,3]`里面所有的元素都是uint8类型，因为在solidity中如果一个值没有指定type的话，默认就是最小单位的该type，这里int的默认最小单位类型就是uint8。而`[uint(1),2,3]`里面的元素都是uint类型，因为第一个元素指定了是uint类型了，我们都以第一个元素为准。
下面的合约中，对于f函数里面的调用，如果我们没有显式对第一个元素进行uint强转的话，是会报错的，因为如上所述我们其实是传入了uint8类型的array，可是g函数需要的却是uint类型的array，就会报错了。
```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract C {
    function f() public pure {
        g([uint(1), 2, 3]);
    }
    function g(uint[3] memory) public pure {
        // ...
    }
}
```
- 如果创建的是动态数组，你需要一个一个元素的赋值。
```solidity
    uint[] memory x = new uint[](3);
    x[0] = 1;
    x[1] = 3;
    x[2] = 4;
```
### 数组成员
- `length`: 数组有一个包含元素数量的`length`成员，`memory`数组的长度在创建后是固定的。
- `push()`: `动态数组`和`bytes`拥有`push()`成员，可以在数组最后添加一个`0`元素。
- `push(x)`: `动态数组`和`bytes`拥有`push(x)`成员，可以在数组最后添加一个`x`元素。
- `pop()`: `动态数组`和`bytes`拥有`pop()`成员，可以移除数组最后一个元素。

**Example:**

## 结构体 struct
`Solidity`支持通过构造结构体的形式定义新的类型。创建结构体的方法：
```solidity
    // 结构体
    struct Student{
        uint256 id;
        uint256 score; 
    }
```
```solidity
    Student student; // 初始一个student结构体
```
给结构体赋值的两种方法：
```solidity
    //  给结构体赋值
    // 方法1:在函数中创建一个storage的struct引用
    function initStudent1() external{
        Student storage _student = student; // assign a copy of student
        _student.id = 11;
        _student.score = 100;
    }
```
**Example:**

```solidity
     // 方法2:直接引用状态变量的struct
    function initStudent2() external{
        student.id = 1;
        student.score = 80;
    }
```
**Example:**

## 总结
这一讲，我们介绍了solidity中数组（`array`）和结构体（`struct`）的基本用法。下一讲我们将介绍solidity中的哈希表——映射（`mapping`）。
# Solidity极简入门: 7. 映射类型 mapping
这一讲，我们将介绍solidity中的哈希表：映射（`Mapping`）类型。

## 映射Mapping
在映射中，人们可以通过键（`Key`）来查询对应的值（`Value`），比如：通过一个人的`id`来查询他的钱包地址。

声明映射的格式为`mapping(_KeyType => _ValueType)`，其中`_KeyType`和`_ValueType`分别是`Key`和`Value`的变量类型。例子：
```solidity
    mapping(uint => address) public idToAddress; // id映射到地址
    mapping(address => address) public swapPair; // 币对的映射，地址到地址
```  
## 映射的规则
- **规则1**：映射的`_KeyType`只能选择`solidity`默认的类型，比如`uint`，`address`等，不能用自定义的结构体。而`_ValueType`可以使用自定义的类型。下面这个例子会报错，因为`_KeyType`使用了我们自定义的结构体：
```solidity
    // 我们定义一个结构体 Struct
    struct Student{
        uint256 id;
        uint256 score; 
    }
     mapping(Student => uint) public testVar;
```
- **规则2**：映射的存储位置必须是`storage`，因此可以用于合约的状态变量，函数中的`storage`变量，和library函数的参数（见[例子](https://github.com/ethereum/solidity/issues/4635)）。不能用于`public`函数的参数或返回结果中，因为`mapping`记录的是一种关系 (key - value pair)。

- **规则3**：如果映射声明为`public`，那么`solidity`会自动给你创建一个`getter`函数，可以通过`Key`来查询对应的`Value`。

- **规则4**：给映射新增的键值对的语法为`_Var[_Key] = _Value`，其中`_Var`是映射变量名，`_Key`和`_Value`对应新增的键值对。例子：
```solidity
    function writeMap (uint _Key, address _Value) public{
        idToAddress[_Key] = _Value;
    }
```
## 映射的原理
- **原理1**: 映射不储存任何键（`Key`）的资讯，也没有length的资讯。

- **原理2**: 映射使用`keccak256(key)`当成offset存取value。

- **原理3**: 因为Ethereum会定义所有未使用的空间为0，所以未赋值（`Value`）的键（`Key`）初始值都是各个type的默认值，如uint的默认值是0。

## 在Remix上验证 (以 `Mapping.sol`为例)
- 映射示例 1 部署


- 映射示例 2 初始值


- 映射示例 3 key-value pair




## 总结
这一讲，我们介绍了`solidity`中哈希表——映射（`Mapping`）的用法。至此，我们已经学习了所有常用变量种类，之后我们会学习控制流`if-else`,` while`等。

# Solidity极简入门: 8. 变量初始值

## 变量初始值

在`solidity`中，声明但没赋值的变量都有它的初始值或默认值。这一讲，我们将介绍常用变量的初始值。

### 值类型初始值

- `boolean`: `false`
- `string`: `""`
- `int`: `0`
- `uint`: `0`
- `enum`: 枚举中的第一个元素
- `address`: `0x0000000000000000000000000000000000000000` (或 `address(0)`)
- `function`
    - `internal`: 空白方程
    - `external`: 空白方程

可以用`public`变量的`getter`函数验证上面写的初始值是否正确：
```solidity
    bool public _bool; // false
    string public _string; // ""
    int public _int; // 0
    uint public _uint; // 0
    address public _address; // 0x0000000000000000000000000000000000000000

    enum ActionSet { Buy, Hold, Sell}
    ActionSet public _enum; // 第1个内容Buy的索引0

    function fi() internal{} // internal空白方程 
    function fe() external{} // external空白方程 
```

### 引用类型初始值
- 映射`mapping`: 所有元素都为其默认值的`mapping`

- 结构体`struct`: 所有成员设为其默认值的结构体

- 数组`array`
    - 动态数组: `[]`
    - 静态数组（定长）: 所有成员设为其默认值的静态数组

可以用`public`变量的`getter`函数验证上面写的初始值是否正确：
```solidity
    // Reference Types
    uint[8] public _staticArray; // 所有成员设为其默认值的静态数组[0,0,0,0,0,0,0,0]
    uint[] public _dynamicArray; // `[]`
    mapping(uint => address) public _mapping; // 所有元素都为其默认值的mapping
    // 所有成员设为其默认值的结构体 0, 0
    struct Student{
        uint256 id;
        uint256 score; 
    }
    Student public student;
```

### `delete`操作符
`delete a`会让变量`a`的值变为初始值。
```solidity
    // delete操作符
    bool public _bool2 = true; 
    function d() external {
        delete _bool2; // delete 会让_bool2变为默认值，false
    }
```
## 在remix上验证
- 部署合约查看值类型、引用类型的初始值

- 值类型、引用类型delete操作后的默认值

## 总结
这一讲，我们介绍了`solidity`中变量的初始值。变量被声明但没有赋值的时候，它的值默认为初始值。不同类型的变量初始值不同，`delete`操作符可以删除一个变量的值并代替为初始值。

# Solidity极简入门: 9. 常数 constant和immutable
这一讲，我们介绍`solidity`中两个关键字，`constant`（常量）和`immutable`（不变量）。状态变量声明这个两个关键字之后，不能在合约后更改数值；并且还可以节省`gas`。另外，只有数值变量可以声明`constant`和`immutable`；`string`和`bytes`可以声明为`constant`，但不能为`immutable`。

## constant和immutable
### constant
`constant`变量必须在声明的时候初始化，之后再也不能改变。尝试改变的话，编译不通过。
``` solidity
    // constant变量必须在声明的时候初始化，之后不能改变
    uint256 constant CONSTANT_NUM = 10;
    string constant CONSTANT_STRING = "0xAA";
    bytes constant CONSTANT_BYTES = "WTF";
    address constant CONSTANT_ADDRESS = 0x0000000000000000000000000000000000000000;
```
### immutable
`immutable`变量可以在声明时或构造函数中初始化，因此更加灵活。
``` solidity
    // immutable变量可以在constructor里初始化，之后不能改变
    uint256 public immutable IMMUTABLE_NUM = 9999999999;
    address public immutable IMMUTABLE_ADDRESS;
    uint256 public immutable IMMUTABLE_BLOCK;
    uint256 public immutable IMMUTABLE_TEST;
```
你可以使用全局变量例如`address(this)`，`block.number` ，或者自定义的函数给`immutable`变量初始化。在下面这个例子，我们利用了`test()`函数给`IMMUTABLE_TEST`初始化为`9`：
``` solidity
    // 利用constructor初始化immutable变量，因此可以利用
    constructor(){
        IMMUTABLE_ADDRESS = address(this);
        IMMUTABLE_BLOCK = block.number;
        IMMUTABLE_TEST = test();
    }

    function test() public pure returns(uint256){
        uint256 what = 9;
        return(what);
    }
```

## 在remix上验证
1. 部署好合约之后，通过remix上的`getter`函数，能获取到`constant`和`immutable`变量初始化好的值。

   
2. `constant`变量初始化之后，尝试改变它的值，会编译不通过并抛出`TypeError: Cannot assign to a constant variable.`的错误。


   
3. `immutable`变量初始化之后，尝试改变它的值，会编译不通过并抛出`TypeError: Immutable state variable already initialized.`的错误。


## 总结
这一讲，我们介绍`solidity`中两个关键字，`constant`（常量）和`immutable`（不变量），让不应该变的变量保持不变。这样的做法能在节省`gas`的同时提升合约的安全性。

# Solidity极简入门: 10. 控制流，用solidity实现插入排序
这一讲，我们将介绍`solidity`中的控制流，然后讲如何用`solidity`实现插入排序（`InsertionSort`），一个看起来简单，但实际上很容易写出`bug`的程序。

## 控制流
`Solidity`的控制流与其他语言类似，主要包含以下几种：

1. `if-else`

```solidity
function ifElseTest(uint256 _number) public pure returns(bool){
    if(_number == 0){
	return(true);
    }else{
	return(false);
    }
}
```
2. `for循环`

```solidity
function forLoopTest() public pure returns(uint256){
    uint sum = 0;
    for(uint i = 0; i < 10; i++){
	sum += i;
    }
    return(sum);
}
```
3. `while循环`

```solidity
function whileTest() public pure returns(uint256){
    uint sum = 0;
    uint i = 0;
    while(i < 10){
	sum += i;
	i++;
    }
    return(sum);
}
```
4. `do-while循环`

```solidity
function doWhileTest() public pure returns(uint256){
    uint sum = 0;
    uint i = 0;
    do{
	sum += i;
	i++;
    }while(i < 10);
    return(sum);
}
```

5. `三元运算符`
三元运算符是`solidity`中唯一一个接受三个操作数的运算符，规则`条件? 条件为真的表达式:条件为假的表达式`。 此运算符经常用作 if 语句的快捷方式。

```solidity
// 三元运算符 ternary/conditional operator
function ternaryTest(uint256 x, uint256 y) public pure returns(uint256){
    // return the max of x and y
    return x >= y ? x: y; 
}
```

另外还有`continue`（立即进入下一个循环）和`break`（跳出当前循环）关键字可以使用。

## 用`solidity`实现插入排序
### 写在前面：90%以上的人用`solidity`写插入算法都会出错。

### 插入排序
排序算法解决的问题是将无序的一组数字，例如`[2, 5, 3, 1]`，从小到大依次排列好。插入排序（`InsertionSort`）是最简单的一种排序算法，也是很多人学习的第一个算法。它的思路很简单，从前往后，依次将每一个数和排在他前面的数字比大小，如果比前面的数字小，就互换位置。示意图：

![插入排序](https://i.pinimg.com/originals/92/b0/34/92b034385c440e08bc8551c97df0a2e3.gif)

### `python`代码
我们可以先看一下插入排序的python代码：
```python
# Python program for implementation of Insertion Sort
def insertionSort(arr):
	for i in range(1, len(arr)):
		key = arr[i]
		j = i-1
		while j >=0 and key < arr[j] :
				arr[j+1] = arr[j]
				j -= 1
		arr[j+1] = key
    return arr
```
### 改写成`solidity`后有`BUG`！
一共8行`python`代码就可以完成插入排序，非常简单。那么我们将它改写成`solidity`代码，将函数，变量，循环等等都做了相应的转换，只需要9行代码：
``` solidity
    // 插入排序 错误版
    function insertionSortWrong(uint[] memory a) public pure returns(uint[] memory) {
        
        for (uint i = 1;i < a.length;i++){
            uint temp = a[i];
            uint j=i-1;
            while( (j >= 0) && (temp < a[j])){
                a[j+1] = a[j];
                j--;
            }
            a[j+1] = temp;
        }
        return(a);
    }
```
那我们把改好的放到`remix`上去跑，输入`[2, 5, 3, 1]`。BOOM！有`bug`！改了半天，没找到`bug`在哪。我又去`google`搜”solidity insertion sort”，然后发现网上用`solidity`写的插入算法教程都是错的，比如：[Sorting in Solidity without Comparison](https://medium.com/coinmonks/sorting-in-solidity-without-comparison-4eb47e04ff0d)

Remix decoded output 出现错误内容

### 正确的solidity插入排序
花了几个小时，在`Dapp-Learning`社群一个朋友的帮助下，终于找到了`bug`所在。`solidity`中最常用的变量类型是`uint`，也就是正整数，取到负值的话，会报`underflow`错误。而在插入算法中，变量`j`有可能会取到`-1`，引起报错。

这里，我们需要把`j`加1，让它无法取到负值。正确代码：
```solidity
    // 插入排序 正确版
    function insertionSort(uint[] memory a) public pure returns(uint[] memory) {
        // note that uint can not take negative value
        for (uint i = 1;i < a.length;i++){
            uint temp = a[i];
            uint j=i;
            while( (j >= 1) && (temp < a[j-1])){
                a[j] = a[j-1];
                j--;
            }
            a[j] = temp;
        }
        return(a);
    }
```
运行后的结果：

!["输入[2,5,3,1] 输出[1,2,3,5]
"](https://images.mirror-media.xyz/publication-images/S-i6rwCMeXoi8eNJ0fRdB.png?height=300&width=554)

## 总结
这一讲，我们介绍了`solidity`中控制流，并且用`solidity`写了插入排序。看起来很简单，但实际很难。这就是`solidity`，坑很多，每个月都有项目因为这些小`bug`损失几千万甚至上亿美元。掌握好基础，不断练习，才能写出更好的`solidity`代码。

---
title: 11. 构造函数和修饰器
tags:
  - solidity
  - basic
  - wtfacademy
  - constructor
  - modifier
---

# Solidity极简入门: 11. 构造函数和修饰器

这一讲，我们将用合约权限控制（`Ownable`）的例子介绍`solidity`语言中构造函数（`constructor`）和独有的修饰器（`modifier`）。

## 构造函数
构造函数（`constructor`）是一种特殊的函数，每个合约可以定义一个，并在部署合约的时候自动运行一次。它可以用来初始化合约的一些参数，例如初始化合约的`owner`地址：
```solidity
   address owner; // 定义owner变量

   // 构造函数
   constructor() {
      owner = msg.sender; // 在部署合约的时候，将owner设置为部署者的地址
   }
```

**注意**⚠️：构造函数在不同的solidity版本中的语法并不一致，在Solidity 0.4.22之前，构造函数不使用 `constructor` 而是使用与合约名同名的函数作为构造函数而使用，由于这种旧写法容易使开发者在书写时发生疏漏（例如合约名叫 `Parents`，构造函数名写成 `parents`），使得构造函数变成普通函数，引发漏洞，所以0.4.22版本及之后，采用了全新的 `constructor` 写法。

构造函数的旧写法代码示例：
```solidity
pragma solidity =0.4.21;
contract Parents {
    // 与合约名Parents同名的函数就是构造函数
    function Parents () public {
    }
}
```
## 修饰器
修饰器（`modifier`）是`solidity`特有的语法，类似于面向对象编程中的`decorator`，声明函数拥有的特性，并减少代码冗余。它就像钢铁侠的智能盔甲，穿上它的函数会带有某些特定的行为。`modifier`的主要使用场景是运行函数前的检查，例如地址，变量，余额等。


![钢铁侠的modifier](https://images.mirror-media.xyz/publication-images/nVwXsOVmrYu8rqvKKPMpg.jpg?height=630&width=1200)

我们来定义一个叫做onlyOwner的modifier：
```solidity
   // 定义modifier
   modifier onlyOwner {
      require(msg.sender == owner); // 检查调用者是否为owner地址
      _; // 如果是的话，继续运行函数主体；否则报错并revert交易
   }
```
带有`onlyOwner`修饰符的函数只能被`owner`地址调用，比如下面这个例子：
```solidity
   function changeOwner(address _newOwner) external onlyOwner{
      owner = _newOwner; // 只有owner地址运行这个函数，并改变owner
   }
```
我们定义了一个`changeOwner`函数，运行他可以改变合约的`owner`，但是由于`onlyOwner`修饰符的存在，只有原先的`owner`可以调用，别人调用就会报错。这也是最常用的控制智能合约权限的方法。

### OppenZepplin的Ownable标准实现：
`OppenZepplin`是一个维护`solidity`标准化代码库的组织，他的`Ownable`标准实现如下：
[https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol)

## Remix 演示示例
以 `Owner.sol` 为例。
1. 在 Remix 上编译部署代码。
2. 点击 `owner` 按钮查看当前 owner 变量。
3. 以 owner 地址的用户身份，调用 `changeOwner` 函数，交易成功。
4. 以非 owner 地址的用户身份，调用 `changeOwner` 函数，交易失败，因为modifier onlyOwner 的检查语句不满足。


## 总结
这一讲，我们介绍了`solidity`中的构造函数和修饰符，并举了一个控制合约权限的`Ownable`合约。
