var _service;

_service = function($rootScope, $cookies, md5) {
  var checkValidTransaction, getPageType, parseCustomerData, parseMovieDetailData, parseMoviesData, parsePeopleData, parseProductInfo, parseSeats, parseTransactionProducts, self;
  self = this;
  self.pageTracking = function(page, slugQuery) {
    var data, dataLayer, pageTracked, pageType;
    pageType = getPageType(page, slugQuery);
    dataLayer = window.dataLayer = window.dataLayer || [];
    pageTracked = {
      pageType: pageType
    };
    data = {
      Page: pageTracked
    };
    if ($rootScope.userInfo != null) {
      data.Customer = parseCustomerData($rootScope.userInfo);
    }
    if (pageType === 'NowShowing') {
      data.Movies = parseMoviesData($rootScope.movieShowing);
    }
    if (pageType === 'ComingSoon') {
      data.Movies = parseMoviesData($rootScope.movieComingSoon);
    }
    if (pageType === 'Actor') {
      data.Actor = parsePeopleData($rootScope.people);
    }
    if (pageType === 'Director') {
      data.Director = parsePeopleData($rootScope.people);
    }
    if (pageType === 'MovieBooking' || pageType === 'MovieDetail') {
      data.Movie = parseMovieDetailData($rootScope.movieDetail);
    }
    dataLayer.push(data);
    return console.log('pageTracking', data, dataLayer);
  };
  self.checkoutTracking = function(event, type, product) {
    var data, dataLayer;
    dataLayer = window.dataLayer = window.dataLayer || [];
    data = {};
    if ($rootScope.userInfo != null) {
      data.Customer = parseCustomerData($rootScope.userInfo);
    }
    data.Movie = parseMovieDetailData($rootScope.movieDetail);
    if (event === 'add') {
      data.event = 'addToCart';
      data.ecommerce = {
        currencyCode: 'VND',
        subTotal: $rootScope.cartSubTotal,
        add: {
          products: parseProductInfo(type, product, $rootScope.movieDetail.name)
        }
      };
    }
    if (event === 'remove') {
      data.event = 'removeFromCart';
      data.ecommerce = {
        currencyCode: 'VND',
        subTotal: $rootScope.cartSubTotal,
        remove: {
          products: parseProductInfo(type, product, $rootScope.movieDetail.name)
        }
      };
    }
    return dataLayer.push(data);
  };
  self.purchaseTracking = function(transactionInfo) {
    var data, dataLayer, isValid, transactionId;
    dataLayer = window.dataLayer = window.dataLayer || [];
    data = {};
    transactionId = transactionInfo.cinemaId + "-" + transactionInfo.vistaTransNumber;
    isValid = checkValidTransaction(transactionId);
    if (!isValid) {
      return;
    }
    if ($rootScope.userInfo != null) {
      data.Customer = parseCustomerData($rootScope.userInfo);
    }
    data.Movie = {
      title: transactionInfo.movieName,
      titleID: transactionInfo.movieId
    };
    data.Cinema = {
      cinemaName: transactionInfo.cinemaName,
      screenName: transactionInfo.screenNumber
    };
    data.ecommerce = {
      purchase: {
        actionField: {
          id: transactionId,
          affiliation: 'Galaxy Cinema',
          revenue: transactionInfo.price,
          tax: 0,
          shipping: 0,
          coupon: ''
        },
        products: parseTransactionProducts(transactionInfo)
      }
    };
    dataLayer.push(data);
    return console.log('purchaseTracking', data, dataLayer);
  };
  getPageType = function(page, slugQuery) {
    var pageType;
    switch (page) {
      case 'trang-chu':
        pageType = 'Home';
        break;
      case 'phim-dang-chieu':
        pageType = 'NowShowing';
        break;
      case 'phim-sap-chieu':
        pageType = 'ComingSoon';
        break;
      case 'dat-ve':
        pageType = 'MovieBooking';
        break;
      case 'dien-anh':
        pageType = 'MovieListing';
        break;
      case 'phim':
        pageType = 'MovieDetail';
        break;
      case 'rap-gia-ve':
        pageType = 'Cinema';
        break;
      case 'khuyen-mai':
        pageType = 'Promotion';
        break;
      case 'phim-hay':
        pageType = 'MovieNews';
        break;
      case 'dien-vien':
        if (slugQuery !== "undefined") {
          pageType = 'Actor';
        } else {
          pageType = 'ActorListing';
        }
        break;
      case 'dao-dien':
        if (slugQuery !== "undefined") {
          pageType = 'Director';
        } else {
          pageType = 'DirectorListing';
        }
        break;
      case 'binh-luan-phim':
        if (slugQuery !== "undefined") {
          pageType = 'MovieReview';
        } else {
          pageType = 'MovieReviewListing';
        }
        break;
      case 'movie-blog':
        if (slugQuery !== "undefined") {
          pageType = 'MovieBlog';
        } else {
          pageType = 'MovieBlogListing';
        }
    }
    return pageType;
  };
  parseCustomerData = function(userInfo) {
    var data;
    data = {
      customerId: userInfo.memberId,
      customerGender: userInfo.gender,
      customerCity: userInfo.city
    };
    if (userInfo.balanceList !== null) {
      data.customerPoint = userInfo.balanceList[0].pointsRemaining;
      data.customerLifePoint = userInfo.balanceList[0].lifetimePointsBalanceDisplay;
    } else {
      data.customerPoint = 0;
      data.customerLifePoint = 0;
    }
    return data;
  };
  parseMoviesData = function(movies) {
    var i, len, movie, parsedMovies;
    parsedMovies = [];
    for (i = 0, len = movies.length; i < len; i++) {
      movie = movies[i];
      parsedMovies.push({
        title: movie.name,
        titleID: movie.id
      });
    }
    return parsedMovies;
  };
  parseMovieDetailData = function(movie) {
    var birthday, cast, casts, data, director, directors, genre, genres, i, j, k, l, len, len1, len2, len3, ref, ref1, ref2, ref3, startDate, studio, studios;
    data = {};
    data.title = movie.name;
    data.titleID = movie.id;
    if (movie.metadata.country != null) {
      data.country = movie.metadata.country[0].name;
    }
    startDate = new Date(movie.startdate);
    data.releaseDate = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate();
    if (movie.metadata.category != null) {
      genres = [];
      ref = movie.metadata.category;
      for (i = 0, len = ref.length; i < len; i++) {
        genre = ref[i];
        genres.push(genre.name);
      }
      data.genre = genres;
    }
    if (movie.metadata.cast != null) {
      casts = [];
      ref1 = movie.metadata.cast;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        cast = ref1[j];
        birthday = new Date(cast.birthday);
        casts.push({
          name: cast.name,
          birthDate: birthday.getFullYear() + "/" + (birthday.getMonth() + 1) + "/" + birthday.getDate()
        });
      }
      data.cast = casts;
    }
    if (movie.metadata.director != null) {
      directors = [];
      ref2 = movie.metadata.director;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        director = ref2[k];
        birthday = new Date(director.birthday);
        directors.push({
          name: director.name,
          birthDate: birthday.getFullYear() + "/" + (birthday.getMonth() + 1) + "/" + birthday.getDate()
        });
      }
      data.director = directors;
    }
    if (movie.metadata.studio != null) {
      studios = [];
      ref3 = movie.metadata.studio;
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        studio = ref3[l];
        studios.push(studio.name);
      }
      data.studio = studios;
    }
    return data;
  };
  parsePeopleData = function(people) {
    var birthday, data;
    birthday = new Date(people.birthday);
    data = {
      name: people.name,
      birthDate: birthday.getFullYear() + "/" + (birthday.getMonth() + 1) + "/" + birthday.getDate(),
      bornCountry: people.country
    };
    return data;
  };
  parseProductInfo = function(type, data, movieName) {
    var id, name, product, products;
    name = '';
    id = '';
    if (type === 'ticket') {
      name = movieName + '/' + data.name + ' - ' + data.description;
      id = data.ticketTypeCode;
    } else if (type === 'concession') {
      name = movieName + '/' + data.description + ' - ' + data.extendedDescription;
      id = data.vistaConcessionId;
    }
    products = [];
    product = {
      name: name,
      id: id,
      price: data.displayPrice,
      brand: '',
      category: type,
      variant: '',
      quantity: 1
    };
    products.push(product);
    return products;
  };
  parseTransactionProducts = function(transactionInfo) {
    var cinemaName, concession, i, j, len, len1, movieName, product, products, ref, ref1, ticket;
    movieName = transactionInfo.movieName;
    cinemaName = transactionInfo.cinemaName;
    products = [];
    ref = transactionInfo.tickets;
    for (i = 0, len = ref.length; i < len; i++) {
      ticket = ref[i];
      product = {
        name: cinemaName + "/" + movieName + "/" + ticket.description,
        id: ticket.ticketTypeCode,
        price: ticket.priceInCents,
        brand: '',
        category: 'ticket',
        variant: '',
        quantity: ticket.totalItem,
        ticketType: ticket.description,
        seats: parseSeats(transactionInfo.seats)
      };
      products.push(product);
    }
    ref1 = transactionInfo.concessions;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      concession = ref1[j];
      product = {
        name: cinemaName + "/" + movieName + "/" + concession.description,
        id: concession.itemId,
        price: concession.priceInCents,
        brand: '',
        category: 'concession',
        variant: '',
        quantity: concession.totalItem
      };
      products.push(product);
    }
    return products;
  };
  parseSeats = function(seats) {
    var data, i, len, results, seat;
    results = [];
    for (i = 0, len = seats.length; i < len; i++) {
      seat = seats[i];
      data = {
        rowID: seat.substr(0, 1),
        seatNumber: seat.substr(1, seat.length)
      };
      results.push(data);
    }
    return results;
  };
  checkValidTransaction = function(transactionId) {
    var id, result;
    transactionId = md5.createHash(transactionId);
    result = false;
    id = $cookies.get('glx_tx');
    if (id === "undefined" || id !== transactionId) {
      $cookies.put('glx_tx', transactionId);
      result = true;
    }
    return result;
  };
  return null;
};

_service.$inject = ['$rootScope', '$cookies', 'md5'];

angular.module('appweb').service('GTMService', _service);
