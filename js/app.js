angular.module("app", ["ngRoute"])
    .config(function ($routeProvider, $locationProvider) {

        // Убрал так как при обновлении не находит страничку
        // $locationProvider.html5Mode(true);

        // Роутинг
        $routeProvider.when("/template/authors", {
            templateUrl: "/template/authors.html"
        });
        $routeProvider.when("/template/books", {
            templateUrl: "/template/books.html"
        });
        $routeProvider.when("/template/add-authors", {
            templateUrl: "/template/add-author.html"
        });
        $routeProvider.when("/template/edit-author", {
            templateUrl: "/template/edit-author.html"
        });
        $routeProvider.when("/template/add-book", {
            templateUrl: "/template/add-book.html"
        });
        $routeProvider.when("/template/edit-book", {
            templateUrl: "/template/edit-book.html"
        });
        $routeProvider.otherwise({
            templateUrl: "/template/authors.html"
        });
    }) // Деректива Datepicker без нее не работает 
    .directive("jqDatepicker", function () {
        return {
            link: function (scope, element, attrs, ctrl) {
                $(element).datepicker({
                    onSelect: function (date) {
                        ctrl.$setViewValue(date);
                        ctrl.$render();
                        scope.$apply();
                    }
                });
            },
            restrict: "A",
            require: "ngModel"
        };
    }) // Контролер по умолчанию
    .controller("defaultCtrl", function ($scope, $location) {

        // Обявлем два контекста Author и Book
        $scope.contextAuthor = modelAuthors.read();
        $scope.contextBook = modelBooks.read();

        
        $scope.book = true;
        $scope.errorRemoveAuthors = false;

        // Роутинг
        $scope.goToAuthors = function () {
            $location.path("/template/authors");
        }
        $scope.goToBooks = function () {
            $location.path("/template/books");
            $scope.book = true;
        }
        $scope.goToAddAuthor = function () {
            $location.path("/template/add-authors");
        }
        $scope.goToEditAuthor = function (item) {
            $scope.item = item;
            $location.path("/template/edit-author");
        }
        $scope.goToAddBook = function () {
            $location.path("/template/add-book");
        }
        $scope.goToEditBook = function (item) {
            $scope.item = item;
            $location.path("/template/edit-book");
        }

        // Проверка перед удалением автора на присутсвие книг у автора
        $scope.checkRemoveAuthor = function (id) {            
            if (modelBooks.checkingBooksFromAuthor(id)) {
                // Если есть запускаем предупреждение
                $scope.errorRemoveAuthors = true;
                // Передаем id автора
                $scope.idRemoveAuthor = id;
            }
            else {
                //Если нет удаляем автора без предупреждения
                modelAuthors.removeItem(id);
                modelAuthors.save();
            }         
        }
        // Согласие на удаление
        $scope.removeAuthor = function (id) {
            // Удаляем все книги
            modelBooks.removeBooksFromAuthor(id);
            // Удаляем автора
            modelAuthors.removeItem(id);
            // Сохраняем модели в LocalStorage
            modelBooks.save();
            modelAuthors.save();
            // Убираем предупреждение
            $scope.errorRemoveAuthors = false;
        }
        // Отказ от удаления
        $scope.notRemoveAuthor = function () {
            // убираем предупреждение
            $scope.errorRemoveAuthors = false;
        } 
        // Удаление книги
        $scope.removeBook = function (id) {
            modelBooks.removeItem(id);
            modelBooks.save();
        }
        // Поиск книги
        $scope.searchBook = function (item) {             
            if (item !== "") {
                // Если строка поиска не пустая, получаем масив нового view
                $scope.viweSearch = modelBooks.search(item);
                // Отображаем
                $scope.book = false;
            } else $scope.book = true; // если строка пустая отключаем отображение
        }        
    })
    // Контролер добавления автора
    .controller("addAuthorCtrl", function ($scope, $location) {
        $scope.addNewAuthor = function (isValid, newAuthor) {
            
            if (isValid) {
                // Если форма валидна, добавляем автора в можель и сохраняем
                modelAuthors.add(newAuthor);
                modelAuthors.save();
                // Убираем отображение ошибки
                $scope.showError = false;
                $location.path("/template/authors");
            }
            else {
                // Если не валидна, отображаем ошибки формы
                $scope.showError = true;
            }
        }
        // Текст ошибки
        $scope.getError = function (error) {
            if (angular.isDefined(error)) {
                if (error.required) {
                    return "Поле обязательно для заполнения";
                }
            }
        }

    })
    // Контролер редактирование автора
    .controller("editAuthorCtrl", function ($scope, $location) {
        // Все тоже что и при добавлении автора
        $scope.editA = function (isValid) {
            if (isValid) {
                modelAuthors.save();
                $scope.showError = false;
                $location.path("/template/authors");
            }
            else {
                $scope.showError = true;
            }
        }
        $scope.getError = function (error) {
            if (angular.isDefined(error)) {
                if (error.required) {
                    return "Поле обязательно для заполнения";
                }
            }
        }
    })
    // Контролер добавление книги
    .controller("addBookCtrl", function ($scope, $location) { 
        // Проверка на наличие автора
        if ($scope.contextAuthor.length != 0) {
            // Если авторы есть, запускаем представление с добавлением книги
            $scope.show = true; 
            // Создаем массив для select
            $scope.authorForSelect = [];

            // Перебераем масив авторов и добавлем в массив select для отображения
            for (var i = 0, len = $scope.contextAuthor.length; i < len; i += 1) {
                if ($scope.authorForSelect.indexOf($scope.contextAuthor[i].id) == -1) {
                    $scope.authorForSelect.push({
                        // создаем обек с id и author 
                        // id для удаления книг при удалении автора
                        // author для отображения в select и в созданой книге
                        id: $scope.contextAuthor[i].id,
                        author: $scope.contextAuthor[i].firstName 
                        + " " + $scope.contextAuthor[i].lastName
                    });
                }
            }              
        }
        // Если автора нет, показывем представление с предуприждением что необходимо добавить автора
        else $scope.show = false;         

        // При изминении автора в select записываем его
        $scope.changeSelectedItem = function (author) {
            $scope.authorSelect = author;
        }

        $scope.addNewBook = function (isValid, newBook) {
            if (isValid) {
                // Если форма валидна, ищем id автора через сравнение имини select
                for (var i = 0, len = $scope.authorForSelect.length; i < len; i += 1) {
                    if ($scope.authorForSelect[i].author == $scope.authorSelect) {
                        // Добавляем в обект id автора
                        newBook.idAuthorBook = $scope.authorForSelect[i].id;
                    }
                }
                // Добавляем в обект имя автора книги
                newBook.authorBook = $scope.authorSelect;

                // Создаем в модели и сохраняем
                modelBooks.add(newBook);
                modelBooks.save();

                $scope.showError = false;                
                $location.path("/template/books");
            }
            else {
                $scope.showError = true;
            }
        };
        $scope.getError = function (error) {
            if (angular.isDefined(error)) {
                if (error.required) {
                    return "Поле обязательно для заполнения";
                }
            }
        }        
    })
    // Все тоже саомом как и при изминении автора
    .controller("editBookCtrl", function ($scope, $location) {

        $scope.editB = function (isValid) {
            if (isValid) {
                modelBooks.save();
                $scope.showError = false;                
                $location.path("/template/books");
            }
            else {
                $scope.showError = true;
            }
        }
        $scope.getError = function (error) {
            if (angular.isDefined(error)) {
                if (error.required) {
                    return "Поле обязательно для заполнения";
                }
            }
        }
    })