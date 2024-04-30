import MetaTrader5 as mt
import pandas as pd
import plotly.express as px
from datetime import datetime
from pprint import pprint

mt.initialize()

login = 10002425763
password = '+pMyUiF1'
server = 'MetaQuotes-Demo'

mt.login(login, password, server)


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


symbol_price = mt.symbol_info_tick("EURUSD")._asdict()
# print(symbol_price)

date1 = datetime(2024,4,25)
date2 = datetime.now()

ohlc_data = pd.DataFrame(mt.copy_rates_range("EURUSD", mt.TIMEFRAME_H1, date1, date2))

pd.set_option('display.max_rows', None)  # Show all rows
pd.set_option('display.max_columns', None)  # Show all columns
pd.set_option('display.width', None)  # Allow the DataFrame to span across the entire width
# fig = px.line(ohlc_data, x=ohlc_data['time'], y=ohlc_data['close'])
# fig.show()

print(ohlc_data)


