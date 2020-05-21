<?
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
include 'dbConfig.php';

$mysqli = new mysqli($dbHost, $dbLogin, $dbPass, $dbName);
if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
}





//смотрим есть ли сортировка по полям
if ($_POST['sort']=='false') {
    $sort=' ';
} else {
    
    $key=null;
    $sortValues=array('title','count','distance');
    $key=array_search($_POST['sortBy'],$sortValues);
    $sortBY=$sortValues[$key];
    $sort="ORDER BY ".$sortBY." ".$_POST['sortDirection'];
}

//смотрим есть ли фильтра
if ($_POST['filter']=='true') {
    //колонка
    $key=null;
    $columnS=array('title','count','distance');
    $key=array_search($_POST['filterColumn'],$columnS);
    $column=$columnS[$key];
    //условие
    $key=null;
    $conditionS=array('equally','contains','more','less');
    $key=array_search($_POST['filterCondition'],$conditionS);
    $condition=$conditionS[$key];
    //ну и спецсимволы из поля ввода можно регуляркой, но можно и так
    $value=htmlspecialchars($_POST['filterValue'], ENT_QUOTES);


    switch ($condition) {
        case 'equally':
            $condition=($column=='title') ? 'LIKE \''.$value.'\'' : '='.$value;           
        break;
        case 'contains':
            $condition= 'LIKE \'%'.$value.'%\'';
        break;    
        case 'more':
            $condition='>'.$value;
        break;
        case 'less':  
            $condition='<'.$value;  
        break;  

    }
    
   $filter='WHERE '.$column.' '.$condition;
   
} else {
    $filter=' ';
}


//количество записей в таблице 
$query="SELECT * FROM dataTable ".$filter;
if ($result=$mysqli->query($query)) {
    $all_rows_count=$result->num_rows; 
    $result->close();
}


//сдвиг для пагинации
$offcet=($_POST['tablePage']-1)*$_POST['rowsOnPage'];

//ииии тадам результирующий запрос
//$query="SELECT * FROM dataTable  ".$sort." LIMIT  ".$_POST['rowsOnPage']." OFFSET ".$offcet;
$query="SELECT * FROM dataTable ".$filter." ".$sort." LIMIT  ".$_POST['rowsOnPage']." OFFSET ".$offcet;

if ($result=$mysqli->query($query)) {
   
  // $rows_count=$result->num_rows;
   $JSONresult=[];
   while ($row = $result->fetch_object()) {
    $JSONresult[]=[
    'date'=>$row->date,
    'title'=>$row->title,
    'count'=>$row->count,
    'distance'=>$row->distance
    ];
   }

   $responeObj=[
      'post'=>'тут были данные для теста, но могли бы быть данные об ошибке',
       'allRowsCount'=>$all_rows_count,
       'result'=>$JSONresult
   ];

echo json_encode($responeObj);
    /* очищаем результирующий набор */
   $result->close();}
?>