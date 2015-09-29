/**
 * Created by shen on 9/26/15.
 */
(function(){
    $(function () {
        $("#add-another-btn.btn").click(function () {
            var accountInfo = [];
            var newAccountInfo = document.getElementById("accountInfo");
            var inputValue = newAccountInfo.getElementsByTagName("input");
            var newaccountInfo = {
                "checkbox": "",
                "account_id": Math.uuid(),
                "amount": "",
                "start_date": "",
                "end_date": "",
                "rate": ""
            };
            $.each(
                inputValue,
                function (name, object) {
                    newaccountInfo[object.id] = $(object).val();
                    /*                var fieldname = object.id;
                     var inputData  = fieldname + ":" + $(object).val();
                     newaccountInfo.push(inputData);*/
                }
            );
            accountInfo.push(newaccountInfo);
            var data = $('#accont-info-table').bootstrapTable('getData');
            if (toString.apply(data) === "[object Array]") {
                $('#accont-info-table').bootstrapTable('append', accountInfo);
            } else {
                $('#accont-info-table').bootstrapTable({
                    data: accountInfo
                });
            }
        });
    });

    $(function () {
        $("#del-select-btn.btn").click(function () {
            var table = $('#accont-info-table');
            var selectedRow = table.bootstrapTable('getSelections');
            var selectedData = selectedRow.pop();
            table.bootstrapTable('remove', {field: 'account_id', values: [selectedData["account_id"]]});
        });
    });
})();