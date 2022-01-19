//var fs = WScript.CreateObject("Scripting.FileSystemObject");
//var word_file = fs.OpenTextFile("../word_list.txt");


//var graph_file = fs.OpenTextFile("../graph_data.txt");

class Dist {
    constructor(weight, dist) {
        this.dist = dist
        this.weight = weight
    }
}

class PriorityQueue {
    constructor() {
      this.heap = [];
    }
    // 要素の追加
    push(item) {
      let heap = this.heap;
      let i = heap.length++;
      let j;
  
      while(i) {
        j = Math.floor((i - 1) / 2);
        if(heap[j] <= item.weight) break;
        heap[i] = heap[j]
        i = j;
      }
      heap[i] = item;
    }

    pop() {
      let heap = this.heap;
      let top = heap[0];
      let popped = heap.pop();
  
      let i = 0;
      let k = Math.floor(heap.length / 2);
      let j;
  
      while(i < k) {
        j = (i * 2) + 1;
        if(heap[j+1] < heap[j]) ++j;
  
        if(popped.weight <= heap[j]) break;
  
        heap[i] = heap[j];
  
        i = j;
      }
  
      if(heap.length) {
        heap[i] = popped;
      }
  
      return top;
    }
  
    // 要素数を返す
    size() {
      return this.heap.length;
    }
  
    // 先頭を返す
    top() {
      return this.heap[0];
    }
}


var words
var graph
window.addEventListener('DOMContentLoaded', function(){
    fetch('https://shogoazgy.github.io/associative-words/word_list.txt') // (1) リクエスト送信
    .then(response => response.text()) // (2) レスポンスデータを取得
    .then(data => { // (3)レスポンスデータを処理
        words = data;  
    });
});

window.addEventListener('DOMContentLoaded', function(){
    fetch('https://shogoazgy.github.io/associative-words/graph_data.txt') // (1) リクエスト送信
    .then(response => response.text()) // (2) レスポンスデータを取得
    .then(data => { // (3)レスポンスデータを処理
        graph = data;
    });
});

var wordbox_element
var first_element
var end_element
window.onload = function() {
    wordbox_element = document.getElementById('word_box');
    first_element = document.getElementById('first');
    end_element = document.getElementById('end');
    console.log(end_element)
};

function OnButtonClick() {
    source = document.getElementById("word_first").value;
    target = document.getElementById("word_end").value;
    first_children = first_element.children;
    for (let i = 0; i < first_children.length; i++) {
        child = first_children[i]
        if (child.textContent == "他の単語で試してください") {
            child.remove()
        }
    }
    end_children = end_element.children;
    for (let i = 0; i < end_children.length; i++) {
        child = end_children[i]
        if (child.textContent == "他の単語で試してください") {
            child.remove()
        }
    }
    wordbox_element.innerHTML = ""
    source_id = Find(source)
    target_id = Find(target)
    if (source_id) {
        if (target_id) {
            dijkstra(source_id, target_id)
        } else {
            display_not_found(0)
        }
    } else {
        if (!target_id) {
            display_not_found(0)
        }
        display_not_found(1)
    }
}

function Find(word) {
    var f 
    var ind
    var words_list
    words_list = words.split('\n')
    f = 0
    for (let i = 0; i < words_list.length; i++) {
        var word_f = words_list[i].split(',');
        var w = word_f[1];
        var ind = Number(word_f[0]);
        if (w == word) {
            f = 1;
            break
        }
    }
    if (f) {
        return ind
    } else {
        return false
    }
}

function display_not_found(q) {
    var new_element = document.createElement('p');
    new_element.classList.add('error')
    new_element.textContent = "他の単語で試してください"
    
    if (q) {
        first_element.appendChild(new_element)
    } else {
        end_element.appendChild(new_element)
    }
}

function dijkstra(start, goal) {
    word_num = 10000
    var prev = []
    const V = word_num
    var used
    //var cost = [...Array(V).keys()].map((d) => {return Array(V).fill(Infinity)});
    //var cost = Array(V).fill(Array(V).fill(Infinity))
    var cost = []
    for (let i = 0; i < V; i++) {
        cost.push(Array(V).fill(Infinity))
    }
    console.log(cost)
    graph_list = graph.split('\n');
    console.log(graph_list.length)
    for (let i = 0; i < graph_list.length; i++) {
        stc = graph_list[i].split(' ');
        if (stc.length != 3) {
            continue
        }
        cost[Number(stc[0]) - 1][Number(stc[1]) - 1] = Math.floor(Number(stc[2])) 
        cost[Number(stc[1]) - 1][Number(stc[0]) - 1] = Math.floor(Number(stc[2]))
    }
    d = Array(V).fill(Infinity);
    used = Array(V).fill(false);
    prev = Array(V).fill(-1);

    wl = {}
    words_list = words.split('\n')
    console.log(words_list.length)
    for (let i = 0; i < words_list.length; i++) {
        word_f = words_list[i].split(',')
        wl[Number(word_f[0]) - 1] = word_f[1]
    }
    
    d[start - 1] = 0
    const pq = new PriorityQueue();
    var s = new Dist(0, start - 1)
    console.log(s)
    pq.push(s)
    console.log('s')
    /*
    while(pq.size()) {
        poped = pq.pop()
        prov_cost = -poped.weight
        src = poped.dist
        //console.log(prov_cost)
        if (d[src] < prov_cost) {
            continue
        }
        for(let i = 0; i < V; i++) {
            c = cost[src][i]
            if (c != Infinity && d[i] > d[src] + c) {
                d[i] = d[src] + c
                ts = new Dist(-d[i], i)
                pq.push(ts)
                prev[i] = src
            }
        }*/
        
        
    while(true) {
        v = -1;
        for(let i = 0; i < V; i++) {
            //console.log(used[i])
            if (!used[i]) {
                if ((v == -1) || (d[i] < d[v])) {
                    v = i
                }
            }
        }
        if (v == -1) {
            console.log('b')
            break
        }
        //console.log(v)
        used[v] = true
        for(let i = 0; i < V; i++) {
            if (d[i] > d[v] + cost[v][i]) {
                d[i] = d[v] + cost[v][i]
                prev[i] = v
            }
        } 
    }
    
    console.log('e')
    console.log(cost)
    var path = []
    var t = goal - 1
    while(t != -1) {
        path.push(wl[t])
        t = prev[t]
    }
    console.log(path)
    console.log(d)
    for (let i = path.length - 2; i > 0; i--) {
        insert_word(path[i])
        if (i != 1) {
            insert_arrow()
        }
    }
}

function insert_word(word) {
    var div_element = document.createElement('div');
    div_element.classList.add("word")
    wordbox_element.appendChild(div_element)
    var new_element = document.createElement('p');
    new_element.textContent = word
    div_element.appendChild(new_element)
}

function insert_arrow() {
    var new_element = document.createElement('div');
    new_element.classList.add("arrow1")
    wordbox_element.appendChild(new_element)

}