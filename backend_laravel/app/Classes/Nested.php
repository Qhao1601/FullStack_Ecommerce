<?php

namespace App\Classes;

use App\Enums\Config\Common;
use Illuminate\Support\Facades\DB;

class Nested
{

    protected $checked;
    protected $data;
    protected $count;
    protected $count_level;
    protected $lft;
    protected $rgt;
    protected $level;
    protected $params;
    protected $auth;

    public function __construct(mixed $params = null)
    {
        $this->params = $params;
        $this->data = null;
        $this->checked = null;
        $this->count = 0;
        $this->count_level = 0;
        $this->lft = null;
        $this->rgt = null;
        $this->level = null;
        $this->auth = auth(Common::API);
    }


    /**
     * [
     *      ['id' => 1, 'name' => 'Electroluc', 'parent_id' => 0]
     *      ['id' => 2, 'name' => 'Phones', 'parent_id' => 1]
     *      ['id' => 3, 'name' => 'Laptops', 'parent_id' => 1]
     *      ['id' => 4, 'name' => 'Smartphone', 'parent_id' => 2]
     *      ['id' => 5, 'name' => 'Furniture', 'parent_id' => 0]
     * 
     * ]
     * 
     * 
     */
    public function get()
    {
        $this->data = DB::table($this->params['table'])
            ->select(['id', 'name', 'parent_id', 'lft', 'rgt', 'level'])
            ->whereNull('deleted_at')
            ->orderBy('lft', 'asc')
            ->get()
            ->toArray();
    }

    /**
     * 
     * Đối với $val = ['id' => 1, 'parent_id' => 0 ]
     * 
     * $arr[1][0] = 1; --> Node 1 là con của node 0
     * $arr[0][1] = 1; --> Node 0 là cha của node 1
     * 
     * Lượt 2: $val = ['id' => 2, 'parent_id' => 1]
     * $arr[2][1] = 1; --> Node 2 là con của node 1
     * $arr[1][2] = 1; --> node 1 là cha của node 2
     * 
     * $arr = [
     *      1 => [ 0 => 1,  2 => 1],
     *      0 => [ 1 => 1 ],
     *      2 => [ 1 => 1 ]
     * ]
     * 
     * ==> xem cái mảng đích $arr cuối cùng nó là cái gì.
     * 
     */
    public function set()
    {
        $arr = null;
        if (isset($this->data) && count($this->data)) {
            foreach ($this->data as $key => $val) {
                $arr[$val->id][$val->parent_id] = 1;
                $arr[$val->parent_id][$val->id] = 1;
            }
        }
        return $arr;
    }


    /**
     * 
     * $arr = [
     *      1 => [ 0 => 1,  2 => 1],
     *      0 => [ 1 => 1 ],
     *      2 => [ 1 => 1 ]
     * ]
     * 
     * Lượt 1: 
     * $this->count = 0;
     * $this->count_level = 0;
     * $this->checked = [];
     * 
     * Gọi lần 1: Recursive(0, $arr)
     * 
     * $start = 0;
     * $this->lft[0] = ++this->count = 1;
     * $this->level[0] = $this->count_level = 0
     * 
     * Duyệt mảng $key = 1, 0 , 2
     * 
     * $key = 1  isset($arr[0][1] == true) ( vì $arr[0][1] = 1 --> nghĩa là 1 là con của 0)
     *           isset($arr[1][0] == true) (vì $arr[1][0] = 1) --> nghĩa là 0 là cha của 1
     *          !isset($this->checked[1][0] --> true) 
     *          !isset($this->checked[0][1] --> true) 
     *  
     * $this->count_level++ = 1; 
     * $this->checked[0][1] = 1;
     * $this->checked[1][0] = 1;
     * 
     * 
     * $key = 0 
     *  Kiểm tra quan hệ
     *      isset($arr[0][0]) --> false
     *      isset($arr[0][0]) --> false
     * 
     * 
     * $key = 2
     *  Kiểm tra quan hệ
     *      isset($arr[0][2]) = false --> node 0 ko có quan hệ trực tiếp với cái node 2
     *      isset($arr[2][0]) = false --> node 2 ko có quan hệ trực tiếp
     * 
     * 
     * 
     * 
     *  Gọi đệ qui: Recursive(1, $arr)
     * $start = 1 (node con của node 0)
     * 
     * $this->lft[1] = 2
     * $this->level[1] = $this->count_level = 1;
     * 
     * Duyệt mảng $arr[1, 0, 2]
     * 
     * $key = 1;
     * 
     * kiểm tra quan hệ
     * isset($arr[1][1] ) false --> bỏ qua luôn
     * 
     * 
     * $key = 0;
     * 
     * kiểm tra quan hệ
     * 
     * isset($arr[1][0])  = true
     * isset($arr[0][1]) = true
     * !isset($this->checked[0][1] == false) --> đã được đánh dấu
     * 
     * 
     * $key = 2;
     * 
     * kiểm tra quan hệ
     * isset($arr[1][2]) = true
     * isset($arr[2][1]) = true
     * !isset($this->checled[1][2] = true --> chưa có)
     * !isset($this->checled[2][1] = true --> chưa có)
     * 
     * $this->count_level++ = 2
     * $this->checked[1][2] = true
     * $this->checked[2][1] = true
     * 
     * Bước 3: Gọi đệ Recursive(2, $arr)
     *  $start = 2;
     * $this->lft[2] = ++this->count = 3  
     * $this->level[2] = $this->count_level = 2;
     * duyệt $arr = [1, 0, 2]
     * $key = 1;
     * isset($arr[2][1]) --> true
     * isset($arr[1][2]) --> true
     * !isset($this->checked[1][2]) --> false 
     * --> bỏ qua
     * 
     * $key = 0
     * 
     * $arr[0][2]
     * --> bỏ qua
     * 
     * $key = 2
     * $arr[2][2] --> bỏ qua
     * 
     * $this->rgt[2] = ++this->count = 4;
     * $this->count_level-- = 1 --> 
     * 
     * 
     * Bước 4: $start = 1;
     * 
     * $this->rgt[1] = ++this->count = 5  [4,5]
     * 
     * --> $start = 0
     * 
     * $this->rgt[0] = ++ this->count = 6
     * 
     * 
     * $this->lft = [0 => 1, 1 => 2, 2 => 3]
     * $this->rgt = [0 => 6, 1 => 5, 2 => 4]
     * $this->level = [0 => 0, 1 => 1, 2 => 2]
     * $this->checked 
     * 
     *  Cây Nested
     * 
     * id       lft             rgt         lelve
     * 0        1               6           0
     * 1        2               5           1
     * 2        3               4           2
     * 
     */
    public function recursive($start = 0, $arr = null)
    {
        $this->lft[$start] = ++$this->count;
        $this->level[$start] = $this->count_level;
        if (isset($arr) && is_array($arr) && count($arr)) {
            foreach ($arr as $key => $val) {
                if ((isset($arr[$start][$key]) || isset($arr[$key][$start])) && (!isset($this->checked[$key][$start])  && !isset($this->check[$start][$key]))) {
                    $this->count_level++;
                    $this->checked[$start][$key] = 1;
                    $this->checked[$key][$start] = 1;
                    $this->recursive($key, $arr);
                    $this->count_level--;
                }
            }
        }
        $this->rgt[$start] = ++$this->count;
    }


    public function action()
    {
        if (
            isset($this->level) &&
            is_array($this->level) &&
            isset($this->lft) && is_array($this->lft) &&
            isset($this->rgt) && is_array($this->rgt)
        ) {
            $data = null;
            foreach ($this->level as $key => $val) {
                if ($key == 0) continue;
                $data[] = [
                    'id' => $key,
                    'level' => $val,
                    'lft' => $this->lft[$key],
                    'rgt' => $this->rgt[$key],
                    'user_id' => $this->auth->user()->id
                ];
            }
            // dd($data);
            if (isset($data) && is_array($data) && count($data)) {
                DB::table($this->params['table'])->upsert($data, 'id', ['lft', 'rgt', 'level']);
                // dd(DB::table($this->params['table'])->upsert($data, 'id', ['lft', 'rgt', 'level']));
            }
        }
    }
}
