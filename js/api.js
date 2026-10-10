async function fetchVideosFromAPI(){
  try{
    if(!window.config?.useYouTubeAPI || !window.config?.apiKey) return null;
    const results = [];
    for(const topic of window.config.topics){
      const q = encodeURIComponent(topic);
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${window.config.maxResults}&q=${q}&key=${window.config.apiKey}`;
      const res = await fetch(url);
      if(!res.ok) throw new Error("YouTube API error");
      const data = await res.json();
      data.items.forEach(item => {
        const chId = item.snippet.channelId;
        if(window.config.channelAllowlist.includes(chId)){
          results.push({
            id: `${topic.replace(/\s+/g,"_").toLowerCase()}_${item.id.videoId}`,
            title: `${item.snippet.title}`,
            videoId: item.id.videoId
          });
        }
      });
    }
    return results.length ? results : null;
  }catch(e){
    console.warn("API fallback engaged:", e.message);
    return null;
  }
}