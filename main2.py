def calculate_ep(distance_km, elevation_gain_m):
    """计算总Ep值（努力值）"""
    return distance_km + elevation_gain_m / 100

def calculate_eph(distance_km, elevation_gain_m, time_str):
    """计算EpH（努力值每小时）"""
    # 将时间字符串转换为小时
    hours = hms_to_hours(time_str)
    total_ep = calculate_ep(distance_km, elevation_gain_m)
    return total_ep / hours

def calculate_time(distance_km, elevation_gain_m, eph):
    """计算预计完成时间并返回hh:mm:ss格式"""
    total_ep = calculate_ep(distance_km, elevation_gain_m)
    hours_decimal = total_ep / eph
    return hours_to_hms(hours_decimal)

def hms_to_hours(time_str):
    """将hh:mm:ss格式转换为小时（十进制）"""
    parts = time_str.split(':')
    if len(parts) == 3:  # hh:mm:ss
        hours, minutes, seconds = map(int, parts)
    elif len(parts) == 2:  # hh:mm
        hours, minutes = map(int, parts)
        seconds = 0
    elif len(parts) == 1:  # 纯小时
        return float(time_str)
    else:
        raise ValueError("无效的时间格式")
    
    return hours + minutes/60 + seconds/3600

def hours_to_hms(hours_decimal):
    """将小时（十进制）转换为hh:mm:ss格式"""
    total_seconds = int(round(hours_decimal * 3600))
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

# 示例计算
if __name__ == "__main__":
    # 示例1：9公里+680米爬升，耗时3:30:00 (3.5小时)
    eph_sample = calculate_eph(9, 680, "3:30:00")
    print(f"示例1 - EpH: {eph_sample:.2f}")  # 输出: 4.51
    
    # 示例2：麦理浩径全走（100公里+4890米爬升），EpH=4.51
    time_required = calculate_time(100, 4890, 4.51)
    print(f"示例2 - 预计时间: {time_required}")  # 输出: 33:01:00

    # 用户输入模式
    print("\nEpH计算器")
    print("1. 计算EpH (需要输入距离、爬升、耗时)")
    print("2. 计算预计时间 (需要输入距离、爬升、EpH)")
    choice = input("请选择计算模式 (1或2): ")

    if choice == '1':
        dist = float(input("距离 (公里): "))
        climb = float(input("爬升高度 (米): "))
        time_str = input("耗时 (格式: hh:mm:ss 或 hh:mm): ")
        result = calculate_eph(dist, climb, time_str)
        print(f"\nEpH = {result:.2f}")
        
    elif choice == '2':
        dist = float(input("距离 (公里): "))
        climb = float(input("爬升高度 (米): "))
        eph = float(input("EpH值: "))
        result = calculate_time(dist, climb, eph)
        print(f"\n预计完成时间 = {result}")
        
    else:
        print("无效选择，请重新运行程序并输入1或2")