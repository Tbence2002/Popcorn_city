const { Component } = React;

class Calendar extends Component {
  state = {
    currentMonth: new Date(),
    bookedDates: []
  };

  generateRandomBooking = () => {
    const { currentMonth } = this.state;
    const daysInMonth = dateFns.getDaysInMonth(currentMonth);
    const randomDaysToGenerate = Math.floor(Math.random() * daysInMonth + 1);

    let bookedDates = [];
    for (let i = 0; i < randomDaysToGenerate; i++) {
      const randomDay = Math.floor(Math.random() * daysInMonth + 1);

      bookedDates.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), randomDay)
      );
    }

    this.setState(() => ({ bookedDates }));
  };

  isBooked = date => {
    const { bookedDates } = this.state;

    return bookedDates.some(bookedDate => dateFns.isSameDay(date, bookedDate));
  };

  nextMonth = () => {
    this.setState(() => ({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    }));
  };

  prevMonth = () => {
    this.setState(() => ({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    }));
  };

  renderButton = () => {
    return (
      <div className="col-center">
        <button onClick={this.generateRandomBooking}>Generate booking</button>
      </div>
    );
  };

  renderHeader = () => {
    const dateFormat = "MMMM YYYY";
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  };

  renderDays = () => {
    const dateFormat = "dddd";
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };

  renderCells = () => {
    const { currentMonth } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : this.isBooked(day)
                  ? "selected"
                  : ""
            }`}
            key={day}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="body">{rows}</div>;
  };

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
        {this.renderButton()}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <div id="logo">
            <span className="icon">date_range</span>
            <span>
              react
              <b>calendar</b>
            </span>
          </div>
        </header>
        <main>
          <Calendar />
        </main>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));