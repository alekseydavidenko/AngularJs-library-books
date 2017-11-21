/* Модель Авторов */

var modelAuthors = (function () {

    // Сассив автора
    var _data = [];

    // Добавление нового автора в массив
    function _add (newAuthor) {
        _data.push({
            id: _getId(),
            lastName: newAuthor.lastName,
            firstName: newAuthor.firstName,            
            fatherName: newAuthor.fatherName,
            date: newAuthor.date
        });
    };
    // Создание уникального id
    function _getId() {
        if (!_data || _data.length == 0) return 0;
        else return (_data[_data.length - 1].id) + 1;
    };
    // Сохранение в LocalStorage
    function _save() {
        window.localStorage["authors"] = JSON.stringify(_data, function (key, val) {
            if (key == '$$hashKey') {
                return undefined;
            }
            return val
        });
    };
    // Чтение с LocalStorage
    function _read() {
        var temp = window.localStorage["authors"]

        if (!temp) _data = [];
        else _data = JSON.parse(temp);

        return _data;
    };
    // Удаление автора
    function _removeItem(id) {
        _data.forEach(function (e, index) {
            if (e.id == id) {
                _data.splice(index, 1);
            }
        })
    }

    return {
        data: _data,
        add: _add,
        read: _read,
        save: _save,
        removeItem: _removeItem
    };
})();

/* Модель Книг */

var modelBooks = (function () {

    // Массив Книги
    var _data = [];

    // Добавление Книги
    function _add(nеwBook) {
        _data.push({
            id: _getId(),
            idAuthorBook: nеwBook.idAuthorBook,
            authorBook: nеwBook.authorBook,
            nameBook: nеwBook.nameBook,
            ganreBook: nеwBook.ganreBook,
            amountPages: nеwBook.amountPages
        })
    }
    // Создание уникального id
    function _getId() {
        if (!_data || _data.length == 0) return 0;
        else return (_data[_data.length - 1].id) + 1;
    };
    // Сохранение в LocalStorage
    function _save() {
        window.localStorage["books"] = JSON.stringify(_data, function (key, val) {
            if (key == '$$hashKey') {
                return undefined;
            }
            return val
        });
    };
    // Чтение с LocalStorage
    function _read() {
        var temp = window.localStorage["books"]

        if (!temp) _data = [];
        else _data = JSON.parse(temp);

        return _data;
    };
    // Удаление автора
    function _removeItem(id) {
        _data.forEach(function (e, index) {
            if (e.id == id) {
                _data.splice(index, 1);
            }
        })
    }
    // Удаление всех книг автора
    function _removeBooksFromAuthor(id) {
        for (var i = 0; i < _data.length; i += 1) {
            if (_data[i].idAuthorBook == id) {
                _data.splice(i--, 1);
            }
        }
    }
    // Проверка наличия книг у автора
    function _checkingBooksFromAuthor(id) {
        for (var i = 0, len = _data.length; i < len; i += 1) {
            if (_data[i].idAuthorBook == id) {
                return true;
            }
        }
        return false;
    }
    // Поиск книг
    function _search(index) {

        var viewSearch = [],
            nameBook;

        for (var i = 0, len = _data.length; i < len; i += 1) {
            nameBook = _data[i].nameBook.toLowerCase();
            if (nameBook.indexOf(index.toLowerCase()) == 0) {
                viewSearch.push(_data[i]);
            }
        }
        return viewSearch;
    }
    return {
        data: _data,
        add: _add,
        read: _read,
        save: _save,
        removeItem: _removeItem,
        removeBooksFromAuthor: _removeBooksFromAuthor,        
        checkingBooksFromAuthor: _checkingBooksFromAuthor,
        search: _search
    }
})();