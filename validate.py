import json,glob
T={"overview":(150,250),"history":(400,700),"architecture":(300,500),"cultural_significance":(200,350)}
C={"features":(5,10),"timeline":(5,10),"stops":(5,8),"facts":(5,10),"nearby":(3,8),"sources":(2,5)}
tot=0
for f in sorted(glob.glob("records/*.json")):
    r=json.load(open(f)); issues=[]
    for k,(a,b) in T.items():
        v=r.get(k); w=len(v.split()) if v and not v.startswith("[") else 0
        if not a<=w<=b: issues.append(k)
    for k,(a,b) in C.items():
        v=r["visitor_guide"]["stops"] if k=="stops" else r[k]
        if not a<=len(v)<=b: issues.append(k)
    if not r["authenticity"]["last_verified_on"]: issues.append("last_verified")
    tot+=len(issues)
print("records:",len(glob.glob("records/*.json")),"| total gaps vs targets:",tot)
