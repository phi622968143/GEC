# process_audio.py
from pydub import AudioSegment
import numpy as np
import noisereduce as nr
import io

def process_audio(file):

    audio = AudioSegment.from_file(io.BytesIO(file.read()), format='mp3')
    louder_audio = audio + 20  

  
    samples = np.array(louder_audio.get_array_of_samples())
    rate = louder_audio.frame_rate

  
    cleaned_samples = nr.reduce_noise(y=samples, sr=rate)

  
    cleaned_audio = AudioSegment(
        cleaned_samples.tobytes(),
        frame_rate=rate,
        sample_width=cleaned_samples.dtype.itemsize,
        channels=1
    )

    #o/w/r
    output_io = io.BytesIO()
    cleaned_audio.export(output_io, format='mp3')
    output_io.seek(0)

    return output_io.getvalue()
