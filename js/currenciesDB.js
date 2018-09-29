    
    // get BTC/USD from 1 last year(every hour)
/*     var finalArr = [];
    $.ajax({
        url: 'https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD/latest?period_id=1HRS&limit=1',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-CoinAPI-Key", "4AB6E6EF-39F2-4BE2-9D52-42F99A63D2A7")
        },
        success: function (data) {
            data.map(item => {
                finalArr.unshift(item.price_high);
            });
            console.log(finalArr);
        }
    })  */


var read = new XMLHttpRequest();
read.open('GET', 'coins_list.txt', false);
read.send();

var allCurrenciesRaw = read.responseText;
var allCurrenciesArr = allCurrenciesRaw.split('\n');
var allCurrenciesHtmlFirstColumn = '';
var allCurrenciesHtmlSecondColumn = '';

/* var currenciesPrice = {
    'USDT': 1,
    'BTC': 6465.98,
    'ETH': 228.61,
    'BCH': 508.43,
    'LTC': 55.73,
    'RPL': 0.29,
    'XMR': 114.81,
    'MKR': 391.68,
    'DASH': 172.90,
    'XRP': 0.29,
} */

read.open('GET', 'coins_price.txt', false);
read.send();
var currenciesPrice = JSON.parse(read.responseText);

allCurrenciesArr.map(item => {
    var coinTitle = item.split('-')[0].trim();
    var coinShort = item.split('-')[1].trim();
    var coinLowerCaseShort = item.split('-')[1].trim().toLowerCase();

    allCurrenciesHtmlFirstColumn +=
        '<div class="exch-dropdown__item" data-name="' + coinTitle + '" data-telegram="' + coinShort + ' ' + coinTitle + ' Room" data-currency="' + coinShort + '">' +
        '<svg class="exch-dropdown__icon clr-coin-' + coinLowerCaseShort + '" role="img" aria-hidden="true">' +
        '<use xmlns: xlink="http://www.w3.org/1999/xlink" xlink: href="img/sprite-inline.svg#coin-' + coinLowerCaseShort + '"></use>' +
        '</svg> <p class="exch-dropdown__title"><b>' + coinShort + '</b> - ' + coinTitle + '</p>' +
        '</div >';

    allCurrenciesHtmlSecondColumn +=
        '<div class="exch-dropdown__item" data-name="' + coinTitle + '" data-currency="' + coinShort + '">' +
        '<svg class="exch-dropdown__icon clr-coin-' + coinLowerCaseShort + '" role="img" aria-hidden="true">' +
        '<use xmlns: xlink="http://www.w3.org/1999/xlink" xlink: href="img/sprite-inline.svg#coin-' + coinLowerCaseShort + '"></use>' +
        '</svg> <p class="exch-dropdown__title"><b>' + coinShort + '</b> - ' + coinTitle + '</p>' +
        '</div >';

});

$('.exch-dropdown__scroll').eq(0).append(allCurrenciesHtmlFirstColumn);
$('.exch-dropdown__scroll').eq(1).append(allCurrenciesHtmlSecondColumn);

const numberWithCommas = (x) => {
    if (x)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var currentWallet;
var ownWallet;

var wallets = {
    ownWallet: {
        'USDT': 100000.00,
        'BTC': 0.00,
        'ETH': 0.00,
        'LTC': 0.00,
        /*         'BCH': 0.00,
                'RPL': 0.00,
                'XMR': 0.00,
                'MKR': 0.00,
                'DASH': 0.00,
                'XRP': 0.00, */
    },
    /*     joeJonsonWallet: {
            'BTC': 1.50,
            'ETH': 15.50,
            'USD': 30000.00,
            'BCH': 10.00,
            'LTC': 0.00,
            'RPL': 0.00,
            'XMR': 0.00,
            'MKR': 0.00,
            'DASH': 0.00,
            'XRP': 0.00,
        },
        haykMinasaynWallet: {
            'BTC': 0.00,
            'ETH': 260.50,
            'USD': 12000.00,
            'BCH': 0.00,
            'LTC': 0.00,
            'RPL': 0.00,
            'XMR': 0.00,
            'MKR': 0.00,
            'DASH': 0.00,
            'XRP': 0.00,
        },
        ranNerWallet: {
            'BTC': 3.00,
            'ETH': 5.50,
            'USD': 3000.00,
            'BCH': 0.00,
            'LTC': 400.00,
            'RPL': 0.00,
            'XMR': 0.00,
            'MKR': 0.00,
            'DASH': 0.00,
            'XRP': 0.00,
        },
        annaPetersonWallet: {
            'BTC': 0.50,
            'ETH': 5.00,
            'USD': 91000.00,
            'BCH': 0.00,
            'LTC': 0.00,
            'RPL': 0.00,
            'XMR': 300.00,
            'MKR': 0.00,
            'DASH': 0.00,
            'XRP': 0.00,
        },
        sofiaPetrosianWallet: {
            'BTC': 10.00,
            'ETH': 12.00,
            'USD': 0.00,
            'BCH': 0.00,
            'LTC': 0.00,
            'RPL': 0.00,
            'XMR': 0.00,
            'MKR': 0.00,
            'DASH': 0.00,
            'XRP': 0.00,
        } */
}

var eachBalance = {};
var eachPercent = {};
var totalBalance;

ownWallet = wallets['ownWallet'];
currentWallet = wallets['ownWallet'];
updateWalletData();

function updateWalletData() {
    totalBalance = 0;
    for (const key in currentWallet) {
        eachBalance[key] = currentWallet[key] * currenciesPrice[key];
        eachBalance[key] = +eachBalance[key].toFixed(2);
        totalBalance += eachBalance[key];

        if (!$('#panel-funds-wallet .basic-table__row[data-currency="' + key + '"]').length) {
            var currencyName = $('.exch-dropdown__item[data-currency="' + key + '"]').eq(0).attr('data-name');
            var newRow = '';
            if ($('body').hasClass('advanced')) {
                newRow = '<div class="basic-table__row disabled" data-currency="' + key + '">' +
                    '<div class="basic-table__col w-30">' +
                    '<svg class="basic-table__curr icon-curr clr-' + currencyName.toLowerCase() + '" role="img" aria-hidden="true">' +
                    '<use xmlns: xlink="http://www.w3.org/1999/xlink" xlink:href="img/sprite-inline.svg#coin-' + key.toLowerCase() + '"></use></svg>' +
                    '<span class="wallet' + key + '"></span> ' + key + ' <span class="smaller" > (' + currencyName + ')</span>' +
                    '</div>' +
                    '<div class="basic-table__col w-20 pricePerCoin' + key + '"></div>' +

                    '<div class = "basic-table__col w-30">'+
                        '<div class = "basic-select custom-select">'+
                        '<select class = "basic-select__select">'+
                        '<option> Choose your custodian </option>'+
                        '<option> HashiCorp Vault </option>'+
                        '<option> IRA Financial Trust </option>'+
                        '<option> Kingdom Trust </option>'+
                        '<option> Trustology </option>'+
                        '<option> Vo1t </option>'+
                        '<option> Xapo Vault </option>'+
                        '</select>'+
                            '<div class = "select-selected basic-select__select" > Choose your custodian </div><div class="select-items select-hide"><div>Choose your custodian</div > <div> HashiCorp Vault </div><div>IRA Financial Trust</div> <div> Kingdom Trust </div><div>Trustology</div> <div> Vo1t </div><div>Xapo Vault</div> </div></div>'+
                        '</div>'+


                    '<div class="basic-table__col w-20">' +
                    '<button class="basic-table__btn" transaction-fancybox>' +
                    '<svg class="sprite-icon qr-code" role="img" aria-hidden="true">' +
                    '<use xmlns: xlink="http://www.w3.org/1999/xlink" xlink:href="img/sprite-inline.svg#qr-code"></use></svg>' +
                    'Receive </button>' +
                    '</div>' +
                    '</div>';
            } else {
                newRow = '<div class="basic-table__row disabled" data-currency="' + key + '">' +
                    '<div class="basic-table__col w-25">' +
                    '<svg class="basic-table__curr icon-curr clr-coin-ltc" role="img" aria-hidden="true">' +
                    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/sprite-inline.svg#coin-' + key.toLowerCase() + '"></use>' +
                    '</svg>' +
                    '<div class="d-flex-col">' +
                    '<span><span class="wallet' + key + '"></span> ' + key + ' </span><span class="smaller">' + currencyName + '</span>' +
                    '</div></div>' +
                    '<div class="basic-table__col w-20 pricePerCoin' + key + '"></div>' +
                    '<div class="basic-table__col w-32"><span class="pricePerCoin' + key + '"></span> <span class="smaller clr-blue">+1.25%</span></div>' +
                    '<div class="basic-table__col w-22"><button class="basic-table__btn fix-width" send-fancybox><svg class="sprite-icon qr-code" role="img" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/sprite-inline.svg#qr-code"></use></svg>' + key + '</button></div>' +
                    '</div>';
            }
            $('#panel-funds-wallet .basic-table__body .basic-table__body').append(newRow);
        }

        if (currentWallet[key].toFixed(2) != 0) {
            if ($('#panel-funds-wallet .basic-table__row[data-currency="' + key + '"]').hasClass('disabled')) {
                $('#panel-funds-wallet .basic-table__row[data-currency="' + key + '"]').removeClass('disabled');
                $('#panel-funds-wallet .basic-table__row[data-currency="' + key + '"]').detach().insertBefore('#panel-funds-wallet .basic-table__row.disabled:first');
            }
        }
        if (currentWallet[key].toFixed(2) == 0) {
            if (!$('#panel-funds-wallet .basic-table__row[data-currency="' + key + '"]').hasClass('disabled')) {
                $('#panel-funds-wallet .basic-table__row[data-currency="' + key + '"]').addClass('disabled');
                $('#panel-funds-wallet .basic-table__row[data-currency="' + key + '"]').detach().insertBefore('#panel-funds-wallet .basic-table__row.disabled:first');
            }
        }

        $('.pricePerCoin' + key).html('$' + numberWithCommas(currenciesPrice[key]));
        $('.wallet' + key).html(numberWithCommas(currentWallet[key].toFixed(2)) + '&nbsp;');

    }
    totalBalance = totalBalance.toFixed(2);

    for (const key in eachBalance) {
        eachPercent[key] = eachBalance[key] / totalBalance;
        eachPercent[key] = eachPercent[key].toFixed(2) * 100; // percent view
    }

    // sort eachPercent object
    var sortable = [];
    for (var currency in eachPercent) {
        sortable.push([currency, eachPercent[currency]]);
    }

    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });

    eachPercent = {};
    // fill object and sort table rows
    sortable.map((item,index) => {
        var key = item[0];
        var value = item[1];
        eachPercent[key] = value;
        if($('#panel-funds-wallet .basic-table__row[data-currency="' + key + '"]').index() != index){
            if (index == 0){
                $('#panel-funds-wallet .basic-table__row[data-currency="' + key + '"]').detach().insertBefore('#panel-funds-wallet .basic-table__body .basic-table__body .basic-table__row:first');
            }
            else{
                $('#panel-funds-wallet .basic-table__row[data-currency="' + key + '"]').detach().insertAfter('#panel-funds-wallet .basic-table__body .basic-table__body .basic-table__row:nth-child(' + index + ')');
            }
        }
    });
    // end of sort

    var totalBalanceTrunc = Math.trunc(totalBalance);
    var totalBalanceFraction = (totalBalance - Math.trunc(totalBalance)).toFixed(2).substr(1);


    $('.totalBalanceTrunc').html(numberWithCommas(totalBalanceTrunc));
    $('.totalBalanceFraction').html(totalBalanceFraction);

    $('.clearPricePerCoinBTC').html(numberWithCommas(currenciesPrice['BTC']));
}
