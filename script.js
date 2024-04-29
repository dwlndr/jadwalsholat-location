$(document).ready(function () {
  function getPrayerTimes(latitude, longitude) {
    // Menampilkan pesan loading saat memuat
    swal({
      title: "",
      text: "Mencari data...",
      icon: "https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif",
      button: false,
    });

    $.ajax({
      url: `http://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=4`,
      method: "GET",
      success: function (res) {
        let date = new Date();
        let today = date.getDate() - 1;
        let data = res.data[today].timings;
        $.each(data, function (name, time) {
          $("#prayerTimesBody").append(`
                        <tr>
                            <td>${name}</td>
                            <td>${time}</td>
                        </tr>
                    `);
        });
        // Tutup pesan loading setelah selesai memuat
        swal.close();
      },
      error: function () {
        $("#prayerTimesBody").html(
          '<tr><td colspan="2">Failed to fetch prayer times.</td></tr>'
        );
        // Tutup pesan loading jika terjadi kesalahan
        Swal.close();
      },
    });
  }

  function getCurrentDate() {
    let date = new Date();
    let options = { year: "numeric", month: "long", day: "numeric" };
    let formattedDate = date.toLocaleDateString(undefined, options);
    let hours = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");
    let seconds = String(date.getSeconds()).padStart(2, "0");
    let formattedTime = `${hours}:${minutes}:${seconds}`;
    $("#tanggalini").text(`${formattedDate} - ${formattedTime}`);
  }

  // function untuk meminta akses lokasi user
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      // Jika geolocation tidak didukung
      error();
    }
  }

  function success(position) {
    getPrayerTimes(position.coords.latitude, position.coords.longitude);
  }

  function error() {
    // Jika geolocation gagal atau tidak didukung, menggunakan koordinat default (Semarang)
    getPrayerTimes("-7.007328320843076", "110.44175439116859");
  }

  getCurrentDate();
  getUserLocation();

  setInterval(function () {
    getCurrentDate();
  }, 1000);
});
