from app.crud.base import CRUDBase
from app.models.weather_info import WeatherInfo
from app.schemas.weather_info import WeatherInfoCreate, WeatherInfoUpdate


class CRUDWeather(CRUDBase[WeatherInfo, WeatherInfoCreate, WeatherInfoUpdate]):
    pass


weather = CRUDWeather(WeatherInfo)
