import MetaTrader5 as mt
import pandas as pd
import plotly.express as px
from datetime import datetime
from datetime import datetime, timedelta
from pprint import pprint
import sys

mt.initialize()

login = 10002425763
password = '+pMyUiF1'
server = 'MetaQuotes-Demo'

mt.login(login, password, server)


symbol_price = mt.symbol_info_tick("EURUSD")._asdict()
# print(symbol_price)

endDate = [2024,4,25]

timeframe = mt.TIMEFRAME_H1

date2 = datetime(endDate[0],endDate[1], endDate[2])

if(timeframe == mt.TIMEFRAME_H1):
    date1 = date2 - timedelta(days=20)

elif(timeframe == mt.TIMEFRAME_M15):
    date1 = date2 - timedelta(days=5)

ohlc_data = pd.DataFrame(mt.copy_rates_range("EURUSD", timeframe, date1, date2))

pd.set_option('display.max_rows', None)  # Show all rows
pd.set_option('display.max_columns', None)  # Show all columns
pd.set_option('display.width', None)  # Allow the DataFrame to span across the entire width
# fig = px.line(ohlc_data, x=ohlc_data['time'], y=ohlc_data['close'])
# fig.show()

print(ohlc_data)


# account_info = mt.account_info()
# print(account_info)

# login_number = account_info.login
# balance = account_info.balance
# equity = account_info.equity

# print(login_number)
# print(balance)
# print(equity)

# num_symbols = mt.symbols_total() 
# print(num_symbols)

# symbols = mt.symbols_get("EURUSD")
# print(symbols)

# symbol_info = mt.symbol_info("EURUSD")._asdict()
# print(symbol_info)

