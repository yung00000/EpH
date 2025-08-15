def calculate_ep(distance_km, elevation_gain_m):
    """
    计算总Ep值（努力值）
    规则：1公里平路 = 100米爬升 = 1 Ep
    """
    return distance_km + elevation_gain_m / 100

def calculate_eph(distance_km, elevation_gain_m, time_hours):
    """
    计算EpH（努力值每小时）
    """
    total_ep = calculate_ep(distance_km, elevation_gain_m)
    return total_ep / time_hours

def calculate_time(distance_km, elevation_gain_m, eph):
    """
    计算预计完成时间（小时）
    """
    total_ep = calculate_ep(distance_km, elevation_gain_m)
    return total_ep / eph

# 示例计算
if __name__ == "__main__":
    # 示例1：9公里+680米爬升，耗时3.5小时
    eph_sample = calculate_eph(9, 680, 3.5)
    print(f"示例1 - EpH: {eph_sample:.2f}")  # 输出: 4.51
    
    # 示例2：麦理浩径全走（100公里+4890米爬升），EpH=4.51
    time_required = calculate_time(100, 4890, 4.51)
    print(f"示例2 - 预计时间: {time_required:.2f} 小时")  # 输出: 33.02小时

    # 用户输入模式
    print("\nEpH计算器模式选择:")
    print("1. 计算EpH (需要输入距离、爬升、耗时)")
    print("2. 计算预计时间 (需要输入距离、爬升、EpH)")
    choice = input("请选择计算模式 (1或2): ")

    if choice == '1':
        dist = float(input("距离 (公里): "))
        climb = float(input("爬升高度 (米): "))
        time = float(input("耗时 (小时): "))
        result = calculate_eph(dist, climb, time)
        print(f"EpH = {result:.2f}")
        
    elif choice == '2':
        dist = float(input("距离 (公里): "))
        climb = float(input("爬升高度 (米): "))
        eph = float(input("EpH值: "))
        result = calculate_time(dist, climb, eph)
        print(f"预计完成时间 = {result:.2f} 小时")
        
    else:
        print("无效选择，请重新运行程序并输入1或2")