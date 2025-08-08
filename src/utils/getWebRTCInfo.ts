export async function getLocalIPs(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        const ips = new Set<string>();
        const pc = new RTCPeerConnection({ iceServers: [] });

        pc.createDataChannel('');

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                const ipMatch = ipRegex.exec(event.candidate.candidate);
                if (ipMatch) {
                    ips.add(ipMatch[1]);
                }
            } else {
                // ICE 收集完成
                pc.close();
                resolve(Array.from(ips)); // ✅ 返回 string[]
            }
        };

        // 超时保护
        const timeoutId = setTimeout(() => {
            pc.close();
            resolve(Array.from(ips));
        }, 2000);

        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .catch(err => {
                clearTimeout(timeoutId);
                pc.close();
                reject(err);
            });
    });
  }