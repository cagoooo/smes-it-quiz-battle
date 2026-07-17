import os
from PIL import Image

def repair_image(path):
    print(f'正在修復圖片: {path}')
    img = Image.open(path).convert('RGBA')
    width, height = img.size
    
    # 1. 清除左右兩邊的垂直白色邊線
    # 掃描左邊
    for x in range(width):
        is_white_line = True
        for y in range(height):
            p = img.getpixel((x, y))
            # 只要有非透明像素，且不是白色的，就說明這不是白線
            if p[3] > 0 and not (p[0] > 240 and p[1] > 240 and p[2] > 240):
                is_white_line = False
                break
        if is_white_line:
            # 將這一列設為透明
            for y in range(height):
                img.putpixel((x, y), (0, 0, 0, 0))
        else:
            # 碰到實體內容，停止清除左側
            break
            
    # 掃描右邊
    for x in range(width - 1, -1, -1):
        is_white_line = True
        for y in range(height):
            p = img.getpixel((x, y))
            if p[3] > 0 and not (p[0] > 240 and p[1] > 240 and p[2] > 240):
                is_white_line = False
                break
        if is_white_line:
            # 將這一列設為透明
            for y in range(height):
                img.putpixel((x, y), (0, 0, 0, 0))
        else:
            # 碰到實體內容，停止清除右側
            break

    # 2. 獲取真實的 bounding box
    bbox = img.getbbox()
    if not bbox:
        print(f'錯誤: {path} 沒有偵測到實體像素')
        return
        
    # 3. 裁剪出龍的實體
    cropped = img.crop(bbox)
    crop_w, crop_h = cropped.size
    
    # 4. 建立 1024x1536 比例的透明背景畫布
    target_w, target_h = 1024, 1536
    canvas = Image.new('RGBA', (target_w, target_h), (0, 0, 0, 0))
    
    # 5. 計算等比例縮小尺寸，高度保留 15% padding
    max_h = int(target_h * 0.85)
    max_w = int(target_w * 0.85)
    
    scale = min(max_w / crop_w, max_h / crop_h)
    new_w = int(crop_w * scale)
    new_h = int(crop_h * scale)
    
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # 6. 置中貼上
    offset_x = (target_w - new_w) // 2
    offset_y = (target_h - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y), resized)
    
    # 7. 儲存圖片
    canvas.save(path, 'PNG')
    print(f'成功修復並優化 {path}，新尺寸為 1024x1536，龍實體尺寸 {new_w}x{new_h}')

if __name__ == '__main__':
    targets = [
        'assets/characters/glitch-dragon.png',
        'assets/characters/cache-golem.png',
        'assets/characters/bot-swarm.png',
        'assets/characters/malware-mimic.png',
        'assets/characters/phishing-siren.png',
        'assets/characters/robotics-ace.png'
    ]
    for target in targets:
        if os.path.exists(target):
            repair_image(target)
        else:
            print(f'找不到檔案: {target}')
