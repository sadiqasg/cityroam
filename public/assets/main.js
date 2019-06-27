$(function() {
  const url = "http://localhost:3000";

  // fetch employees from json db
  let getEmployees = () => {
    $.ajax({
      type: "GET",
      url: `${url}/employees`,
      dataType: "json",
      success: result => {
        let records = "";
        let employees = "";
        let total = result.length;

        $("#numberOfemployees").html(total);

        for (var i in result) {
          records += `<tr id='${result[i].id}'>
                      <td class='table-rows'>${result[i].id}</td>
                      <td class='table-rows'>${result[i].firstName}</td>
                      <td class='table-rows'>${result[i].lastName}</td>
                      <td class='table-rows'>${result[i].email}</td>
                      <td class='table-rows'>${result[i].gender}</td>
                      <td id='${
                        result[i].id
                      }'><button class="btn btn-info stat" data-toggle="modal" data-target="#editModal">edit status</button><button class='btn btn-danger deleteEmployees'>delete</button></td></tr>
                  `;

          employees += `<a class='btn btn-outline-success m-1' id='${
            result[i].firstName
          } ${result[i].lastName}' onclick='attndBtn(this.id)'>${
            result[i].firstName
          } ${result[i].lastName}</a>`;
        }

        $("#employeesTableBody").html(records);
        $("#employeesAttendance").html(employees);
      },
      error: err => console.log("error", err)
    });
  };

  // get meetings history from db
  let getHistory = () => {
    $.ajax({
      type: "GET",
      url: `${url}/meetings`,
      dataType: "json",
      success: result => {
        let history = "";
        let total = result.length;

        $("#totalMeetings").html(total);

        for (var i in result) {
          history += `<tr id="${result[i].id}">
                      <td>${result[i].id}</td>
                      <td>${result[i].title}</td>
                      <td><button class='btn btn-info viewAttendance'>view</button></td></tr>
                 `;
        }

        $("#meetingsTableBody").html(history);
      },
      error: err => console.log("error", err)
    });
  };

  // get employee by id record on employees table
  $(document).on("click", ".table-rows", function() {
    let id = $(this)
      .parent()
      .attr("id");

    $.ajax({
      type: "GET",
      url: `${url}/employees/${id}`,
      success: data => {
        $("#employeeNumber").text(`${data.id}`);
        $("#employeeGender").text(`${data.gender}`);
        $("#employeeName").text(`${data.firstName} ${data.lastName}`);
        $("#employeeMail").text(`${data.email}`);
        $('#employeeStatus').text(`${data.status}`);
        $(".myBtn").click();
      },
      error: e => console.log(e)
    });
  });

  // patch employee status
  $(document).on("click", ".stat", function() {
    let thisId = $(this)
      .parent()
      .attr("id");

    $("#this-id").text(thisId);
  });

  // patch button
  $("#updateStatus").on("click", () => {
    let id = $("#this-id").text();
    let status = $("#status").val();
    if (!status) return;

    let stat = {
      status: $("#status").val()
    };

    $.ajax({
      type: "PATCH",
      url: `${url}/employees/${id}`,
      data: JSON.stringify(stat),
      dataType: "json",
      contentType: 'application/json',
      success: data => {
        $('#closePatch').click();
      },
      error: e => console.log("error", e)
    });
  });

  // view attendance list
  $(document).on("click", ".viewAttendance", function() {
    var id = $(this)
      .closest("tr")
      .attr("id");

    $.ajax({
      type: "get",
      url: `${url}/meetings/${id}`,
      dataType: "json",
      success: data => {
        let attendees = data.attendance;
        let list = "";
        for (let i = 0; i < attendees.length; i++) {
          list += `<p class="attnd-p">${attendees[i]}</p>`;
        }
        $("#meeting-title").text(`"${data.title}"`);
        $("#attendees-list").html(list);
        $(".myBtn2").click();
      },
      error: err => {
        console.log(err);
      }
    });
  });

  // delete employees
  $(document).on("click", ".deleteEmployees", function() {
    let id = $(this)
      .closest("tr")
      .attr("id");

    $.ajax({
      type: "DELETE",
      url: `${url}/employees/${id}`,
      dataType: "json",
      success: data => {
        console.log("deleted", id, data);
        getEmployees();
      },
      error: err => {
        console.log("error", err);
      }
    });
  });

  // create/save employee
  $("#saveEmployee").on("click", e => {
    e.preventDefault();

    var employee = {
      firstName: $("input#first_name").val(),
      lastName: $("input#last_name").val(),
      email: $("input#email").val(),
      gender: $("input#gender").val(),
      status: "never attendend"
    };

    $.ajax({
      type: "POST",
      data: JSON.stringify(employee),
      url: "http://localhost:3000/employees",
      dataType: "json",
      contentType: "application/json",
      success: function(data) {
        console.log("saved", data);
        $("#closeModal").click();
        getEmployees();
      },
      error: function(e) {
        console.error("err", e);
      }
    });
  });

  // post attendance record
  $("#saveEmployeeAttendance").on("click", e => {
    e.preventDefault();
    let title = $("#meetingTitle").val();
    if (!title) return;

    let meeting = {
      title: title,
      attendance: attendees
    };

    $.ajax({
      type: "POST",
      url: `${url}/meetings`,
      data: JSON.stringify(meeting),
      dataType: "json",
      contentType: "application/json",
      success: res => {
        console.log("success", res);
        $("#closeMeetingModal").click();
        getEmployees();
        getHistory();
        $("#meetingTitle").val("");
      },
      error: err => {
        console.log("error", err);
      }
    });
  });

  getEmployees();
  getHistory();
}); //end jq

// mark attendance
let attendees = [];
function attndBtn(id) {
  document.getElementById(id).style.cssText =
    "background-color:lightgreen;color: white;";
  attendees.push(id);
}

// Get the modals
var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");

var btn = document.querySelector(".myBtn");
var btn2 = document.querySelector(".myBtn2");

var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close2")[0];

btn.onclick = function() {
  modal.style.display = "block";
};
btn2.onclick = function() {
  modal2.style.display = "block";
};

span.onclick = function() {
  modal.style.display = "none";
};
span2.onclick = function() {
  modal2.style.display = "none";
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  } else if (event.target == modal) {
    modal.style.display = "none";
  }
};
