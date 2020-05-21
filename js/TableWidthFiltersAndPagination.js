class TableWidthFiltersAndPagination {

    constructor(config) {
        //объект в котором хранится состояние 
        this.dataForRespone = {};

        this.dataForRespone.sort = false;
        this.dataForRespone.sortBy = null;
        this.dataForRespone.sortDirection = null;

        this.dataForRespone.filter = false;
        this.dataForRespone.filterColumn = null;
        this.dataForRespone.filterCondition = null;
        this.dataForRespone.filterValue = null;

        this.dataForRespone.tablePage = 1;
        this.dataForRespone.rowsOnPage = config.rowsOnPage;

        this.titleSortDirection = null;
        this.countSortDirection = null;
        this.distanceSortDirection = null;

        this.allRowsCount = 0;
        this.data = [];

        this.htmlElements = {};

        this.getRespone(this.dataForRespone);

        this.htmlElements.container = document.querySelector('#' + config.id);

        this.drawTableWidthFiltersAndPagination(this.htmlElements.container);

        //обработчики на заголовки таблички для сортировки при клике на заголовок таблицы
        this.htmlElements.headersClickToSort = this.htmlElements.container.querySelectorAll('.sort');
        this.htmlElements.headersClickToSort.forEach(header => {
            header.addEventListener('click', (e) => {
                let field = e.toElement.dataset.sortBy;
                this.sortTablebyField(field);
            })
        })
        //обработчики для фильтров
        this.htmlElements.filtersColumn = this.htmlElements.container.querySelector('.filters_column');
        this.htmlElements.filtersCondition = this.htmlElements.container.querySelector('.filters_condition');
        this.htmlElements.filterValue = this.htmlElements.container.querySelector('.filters_text');
        this.htmlElements.filtersBtn = this.htmlElements.container.querySelector('.filters_btn');

        this.htmlElements.filtersColumn.disabled = false;
        this.htmlElements.filtersCondition.disabled = true;
        this.htmlElements.filterValue.disabled = true;
        this.htmlElements.filtersBtn.disabled = true;

        //для удобства читаемости не будем пильть все в один метод, а сделаем по порядку
        this.htmlElements.filtersColumn.addEventListener('change', (e) => {
            this.filtersSelectColumn(this.htmlElements.filtersColumn.value);
        })
        this.htmlElements.filtersCondition.addEventListener('change', (e) => {
            this.filtersSelectCondition(this.htmlElements.filtersCondition.value);
        })
       
        this.htmlElements.filtersBtn.addEventListener('click', (e) => {
           
            this.filtersClickBtn();
        })


    }

    getRespone(state) {
        $.ajax({
            type: "POST",
            url: 'respone.php',
            data: state,
            success: (resp) => {
                resp = JSON.parse(resp);
                // console.log(resp);
                this.data = resp.result;
                this.allRowsCount = resp.allRowsCount;
                //так как данные появляются позже, то рисуем мы их тоже после того, как они появились
                this.drowTableBody(this.data);
                this.drawLi();
            },
            error: function (resp) {
               // console.log(resp);
            }
        })
    }

    drawTableWidthFiltersAndPagination(container) {
        this.drawFilters();
        this.drawTable(this.data);
        this.drawPagination();
    }

    drawFilters() {
        let htmlToAdd = '';
        htmlToAdd = '<div class="filters">' +
            '<select class="filters_column">' +
            '<option value="">Выбор колонки</option>' +
            '<option value="title">Название</option>' +
            '<option value="count">Количество</option>' +
            '<option value="distance">Расстояние</option>' +
            '</select>' +
            '<select class="filters_condition" >' +
            '<option value="">Выбор условия</option>' +
            '<option value="equally" class="equally">Равно</option>' +

            '<option value="contains"  class="contains">Содержит</option>' +
            '<option value="more"  class="more">Больше</option>' +
            '<option value="less"  class="less">Меньше</option>' +
            '</select>' +
            '<input type="text" class="filters_text"/>' +
            '<button class="filters_btn">фильтровать</button>' +
            '</div>';
        this.htmlElements.container.innerHTML += htmlToAdd;
    }

    filtersSelectColumn(val) {
        
        switch (val) {
            case 'title':
                
                this.htmlElements.filtersCondition.disabled = false;
                this.htmlElements.container.querySelector('.equally').disabled = false;
                this.htmlElements.container.querySelector('.contains').disabled = false;
                this.htmlElements.container.querySelector('.less').disabled = true;
                this.htmlElements.container.querySelector('.more').disabled = true;
                this.htmlElements.filterValue.disabled = true;
                this.htmlElements.filtersBtn.disabled = true;
                this.htmlElements.filterValue.type = 'text';
                //сбросим фильтра
                this.dataForRespone.filter = false;
                this.getRespone(this.dataForRespone);
                break;
            case 'count':
                
                this.htmlElements.filtersCondition.disabled = false;
                this.htmlElements.container.querySelector('.equally').disabled = false;
                this.htmlElements.container.querySelector('.contains').disabled=true;
                this.htmlElements.container.querySelector('.less').disabled = false;
                this.htmlElements.container.querySelector('.more').disabled = false;
                this.htmlElements.filterValue.disabled = true;
                this.htmlElements.filtersBtn.disabled = true;
                this.htmlElements.filtersClickBtn = true;
                this.htmlElements.filterValue.type = 'number';
                //сбросим фильтра
                this.dataForRespone.filter = false;
                this.getRespone(this.dataForRespone);
                break;
            case 'distance':
                
                this.htmlElements.filtersCondition.disabled = false;
                this.htmlElements.container.querySelector('.equally').disabled = false;
                this.htmlElements.container.querySelector('.contains').disabled = true;
                this.htmlElements.container.querySelector('.less').disabled = false;
                this.htmlElements.container.querySelector('.more').disabled = false;
                this.htmlElements.filterValue.disabled = true;
                this.htmlElements.filtersBtn.disabled = true;
                this.htmlElements.filtersClickBtn = true;
                this.htmlElements.filterValue.type = 'number';
                //сбросим фильтра
                this.dataForRespone.filter = false;
                this.getRespone(this.dataForRespone);
                break;

            default:
               
                this.htmlElements.filtersCondition.disabled = true;
                this.htmlElements.filterValue.disabled = true;
                this.htmlElements.filtersBtn.disabled = true;
                this.dataForRespone.filterColumn = null;
                this.dataForRespone.filterCondition = null;
                this.dataForRespone.filterValue = null;
                this.htmlElements.filterValue.type = 'text';
                //сбросим фильтра
                this.dataForRespone.filter = false;
                this.getRespone(this.dataForRespone);
                break;
        }
    }

    filtersSelectCondition(val) {
        switch (val) {
            case 'equally':
                this.htmlElements.filterValue.disabled = false;
                this.htmlElements.filtersBtn.disabled = false;
                break;
            case 'contains':
                this.htmlElements.filterValue.disabled = false;
                this.htmlElements.filtersBtn.disabled = false;
                break;
            case 'more':
                this.htmlElements.filterValue.disabled = false;
                this.htmlElements.filtersBtn.disabled = false;
                break;
            case 'less':
                this.htmlElements.filterValue.disabled = false;
                this.htmlElements.filtersBtn.disabled = false;
                break;
            default:
                this.htmlElements.filterValue.disabled = true;
                this.htmlElements.filtersBtn.disabled = true;
                break;
        }
    }

   

    filtersClickBtn() {
        if (this.htmlElements.filterValue.value === '') {
            alert('необходимо корректно заполнить все поля ');
        } else {
            this.dataForRespone.filter = true;
            this.dataForRespone.filterColumn = this.htmlElements.filtersColumn.value;
            this.dataForRespone.filterCondition =this.htmlElements.filtersCondition.value;
            this.dataForRespone.filterValue = this.htmlElements.filterValue.value;
            this.getRespone(this.dataForRespone);
        };
    }

    drawPagination() {
        let htmlToAdd = '<div class="pagination">' +
            '<ul>' +

            '</ul></div>';
        this.htmlElements.container.innerHTML += htmlToAdd;
        this.drawLi();


    }

    drawLi() {
        let ul = this.htmlElements.container.querySelector('ul');

        let htmlToAdd = '';
        //посмотрим сколько всего ссылок для пагинации сделать
        let pageCount = 0;
        if (this.allRowsCount % this.dataForRespone.rowsOnPage == 0) {
            pageCount = this.allRowsCount / this.dataForRespone.rowsOnPage;
        } else {
            pageCount = (this.allRowsCount - this.allRowsCount % this.dataForRespone.rowsOnPage) / this.dataForRespone.rowsOnPage + 2;
            pageCount = (this.allRowsCount - this.allRowsCount % this.dataForRespone.rowsOnPage) / this.dataForRespone.rowsOnPage + 2;


        }
        // нарисуем li-шки
        let i;
        for (i = 1; i < pageCount; i++) {
            if (i == this.dataForRespone.tablePage) {
                htmlToAdd += '<li data-page-to="' + i + '" class="pagination_li pagination_li-active">' + i + '</li>';
            } else {
                htmlToAdd += '<li data-page-to="' + i + '" class="pagination_li">' + i + '</li>';
            }

        }
        ul.innerHTML = htmlToAdd;

        //повесим обработчики кликов на li после того, как их показали
        this.htmlElements.paginationElToClick = this.htmlElements.container.querySelectorAll('li');
        this.htmlElements.paginationElToClick.forEach(header => {
            header.addEventListener('click', (e) => {
                let tab = e.toElement.dataset.pageTo;
                this.dataForRespone.tablePage = tab;
                this.getRespone(this.dataForRespone);
            })
        })
    }

    drawTable(data) {
        let htmlToAdd = '';
        htmlToAdd =
            '<table class="table">' +
            '<thead><tr><th class="date">Дата</th>' +
            '   <th class="sort"  data-sort-by="title" >Название</th>' +
            '   <th class="sort" data-sort-by="count">Количество</th>' +
            '   <th class="sort" data-sort-by="distance">Расстояние</th></tr></thead>' +
            '<tbody class="table_body">' +
            '</tbody><table>';

        this.htmlElements.container.innerHTML += htmlToAdd;
        this.drowTableBody(data);


    }

    drowTableBody(data) {
        let htmlToAdd = '';
        data.forEach(row => {
            htmlToAdd += '<tr>' +
                '<td>' + row.date + '</td>' +
                '<td>' + row.title + '</td>' +
                '<td>' + row.count + '</td>' +
                '<td>' + row.distance + '</td>' +
                '</tr>';
        })
        this.tableBody = this.htmlElements.container.querySelector('tbody');
        this.tableBody.innerHTML = htmlToAdd;

    }

    sortTablebyField(field) {

        /*
         в случае, если данных определенно будет мало, и данные абсолютно точно не меняются, 
         то чисто теоретически можно пагинацию и сортировку сделать  на стороне пользователя.
         в таком случае например метод для сортировки будет выглядеть так:
     
         //сортировка по словам не такая как по числам, поэтому делаем отдельно
         if (field == 'title') {
             this.data.sort(function (a, b) {
                 let first = a[field], second = b[field];
                 if (first < second) {
                     return -1;
                 } else if (first > second) {
                     return 1;
                 } else return 0
 
             })
         } else {
             this.data.sort(function (a, b) {
                 let first = a[field], second = b[field];
                 return first - second
 
             })
         }
         // меняем направление сортировки
         if (this.sortDirection == 'asc') {
             this.sortDirection = 'desc';
         } else {
             this.data.reverse();
             this.sortDirection = 'asc';
         } 
         */

        this.dataForRespone.sort = true;
        //разбираемся с направлениями для сортировки
        switch (field) {
            case 'title':
                this.dataForRespone.sortBy = 'title';
                this.titleSortDirection = (this.titleSortDirection == 'ASC') ? 'DESC' : 'ASC';
                this.dataForRespone.sortDirection = this.titleSortDirection
                
                break;
            case 'count':
                this.dataForRespone.sortBy = 'count';
                this.countSortDirection = (this.countSortDirection == 'ASC') ? 'DESC' : 'ASC';
                this.dataForRespone.sortDirection = this.countSortDirection;
               
                break;
            case 'distance':
                this.dataForRespone.sortBy = 'distance';
                this.distanceSortDirection = (this.distanceSortDirection == 'ASC') ? 'DESC' : 'ASC';
                this.dataForRespone.sortDirection = this.distanceSortDirection;
                
                break;
        }

        this.getRespone(this.dataForRespone);
    }





}

