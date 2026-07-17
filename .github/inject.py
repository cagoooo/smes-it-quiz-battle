import os

def inject():
    supabase_url = os.environ.get("VITE_SUPABASE_URL", "")
    supabase_key = os.environ.get("VITE_SUPABASE_ANON_KEY", "")
    
    if not supabase_url or not supabase_key:
        print("未檢測到 VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY 環境變數，跳過注入")
        return
        
    targets = ["game.js", "console.html"]
    for target in targets:
        if not os.path.exists(target):
            continue
            
        with open(target, "r", encoding="utf-8") as f:
            content = f.read()
            
        new_content = content.replace("__SUPABASE_URL__", supabase_url)
        new_content = new_content.replace("__SUPABASE_ANON_KEY__", supabase_key)
        
        with open(target, "w", encoding="utf-8") as f:
            f.write(new_content)
            
        print(f"成功注入金鑰至 {target}")

if __name__ == "__main__":
    inject()
