import MetaTrader5 as mt
import pandas as pd
import plotly.express as px
from datetime import datetime

mt.initialize()

login = 10002425763
password = '+pMyUiF1'
server = 'MetaQuotes-Demo'

mt.login(login, password, server)


account_info = mt.account_info()
print(account_info)

login_number = account_info.login
balance = account_info.balance
equity = account_info.equity

print(login_number)
print(balance)
print(equity)

# num_symbols = mt.symbols_total() 
# print(num_symbols)

# symbols = mt.symbols_get("EURUSD")
# print(symbols)

# symbol_info = mt.symbol_info("EURUSD")._asdict()
# print(symbol_info)


symbol_price = mt.symbol_info_tick("EURUSD")._asdict()
print(symbol_price)

ohlc_data = pd.DataFrame(mt.copy_rates_range("EURUSD", mt.TIMEFRAME_H1, datetime(2024,4,17), datetime.now()))

fig = px.line(ohlc_data, x=ohlc_data['time'], y=ohlc_data['close'])
fig.show()
print(ohlc_data)